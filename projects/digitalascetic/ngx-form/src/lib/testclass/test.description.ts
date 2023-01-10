import {Type} from '@digitalascetic/ngx-reflection';

export class TestDescription {

  @Type()
  private _id: number;

  @Type()
  private _text: string;

  @Type()
  private _active: boolean;

  @Type()
  private _props: string[];

  constructor(text: string, id?: number) {
    this._text = text;
    this._id = id;
  }

  get id(): number {
    return this._id;
  }

  get text(): string {
    return this._text;
  }

  get active(): boolean {
    return this._active;
  }

  set active(value: boolean) {
    this._active = value;
  }

  get props(): string[] {
    return this._props;
  }

  set props(value: string[]) {
    this._props = value;
  }
}
