import { TestScheduler } from 'rxjs/testing';
import { ReposListForOrgResponse } from './interfaces';
import { response } from './mocks/repos.listForOrg.response';
import { parseResponse, RepositoriesClient } from './repositories-client';

describe('RepositoriesClient', () => {
  let sched: TestScheduler;
  beforeEach(() => {
    sched = new TestScheduler((a, b) => expect(a).toEqual(b));
  });
  describe('parseResponse', () => {
    it('should extract the correct data from a real response', () => {
      const actual = parseResponse(response);
      const expected: ReposListForOrgResponse = {
        results: [
          {
            name: 'media',
          },
          {
            name: 'albino',
          },
          {
            name: 'hubahuba',
          },
          {
            name: 'jquery-hotkeys',
          },
        ]
      };
      expect(actual).toEqual(expected);
    });
  });
});
