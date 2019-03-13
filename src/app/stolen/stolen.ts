import { ObservableWorkStateMap } from '@vendasta/rx-utils';
import { Observable, of, race, SchedulerLike } from 'rxjs';
import { delay, share, switchMap } from 'rxjs/operators';

export function doWorkIfInitial<I, T>(
    workId: I, stateMap: ObservableWorkStateMap<I, T>,
    work: () => Observable<T>,
    scheduler?: SchedulerLike,
): Observable<T> {
    const workWithDelay: Observable<T> = of(workId).pipe(
        delay(10, scheduler),
        switchMap(id => {
            stateMap.startWork(id, work());
            return stateMap.getWorkResults$(workId);
        }),
        share(),
    );
    return race(workWithDelay, stateMap.getWorkResults$(workId));
}
