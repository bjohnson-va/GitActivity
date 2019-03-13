import { WorkStateMap, WorkStates } from '@vendasta/rx-utils';
import { map } from 'rxjs/operators';

export function withConversion<S, T>(
    workState: WorkStates<S>,
    converter: (s: S) => T
): WorkStates<T> {
    return {
        isLoading$: workState.isLoading$,
        isSuccess$: workState.isSuccess$,
        successEvents$: workState.successEvents$,
        workResults$: workState.workResults$.pipe(map(converter)),
    };
}

export function withConversionButWithMaps<ID, S, T>(
    workState: WorkStateMap<ID, S>,
    converter: (s: S) => T
): WorkStateMap<ID, T> {
    return {
        isLoading$: (id: ID) => workState.isLoading$(id),
        isSuccess$: (id: ID) => workState.isSuccess$(id),
        successEvent$: (id: ID) => workState.successEvent$(id),
        getWorkResults$: (id: ID) => workState.getWorkResults$(id).pipe(map(converter)),
    };
}

export function withSideEffect<ID, S>(workState: WorkStateMap<ID, S>, fn: (id: ID) => any): WorkStateMap<ID, S> {
    return {
        isLoading$: (id: ID) => workState.isLoading$(id),
        isSuccess$: (id: ID) => workState.isSuccess$(id),
        successEvent$: (id: ID) => workState.successEvent$(id),
        getWorkResults$: (id: ID) => workState.getWorkResults$(id).pipe(() => fn(id)),
    };
}
