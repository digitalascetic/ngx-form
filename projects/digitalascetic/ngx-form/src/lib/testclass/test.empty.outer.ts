import {Type} from '@digitalascetic/ngx-reflection';
import {TestEmptyInner} from './test.empty.inner';

export class TestEmptyOuter {

  @Type(() => TestEmptyInner)
  nested: TestEmptyInner;

}
