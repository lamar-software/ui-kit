import { Directive, ElementRef, Input, NgZone, OnChanges, OnDestroy, OnInit, Optional, Self } from '@angular/core';
import { FormGroupDirective, NgControl, ControlValueAccessor } from '@angular/forms';

import {
  CanUpdateErrorState,
  CanUpdateErrorStateCtor,
  ErrorStateMatcher,
  mixinErrorState
} from '@angular/material/core';

import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { getSupportedInputTypes, Platform } from '@angular/cdk/platform';
import { AutofillMonitor } from '@angular/cdk/text-field';

import { Subject } from 'rxjs';

// Invalid input type. Using one of these will throw an error.
const MAT_INPUT_INVALID_TYPES = ['button', 'checkbox', 'file', 'hidden', 'image', 'radio', 'range', 'reset', 'submit'];

let nextUniqueId = 0;

@Directive({
  selector: `input[uiKitInput], textarea[uiKitInput], select[matNativeControl], input[matNativeControl], textarea[matNativeControl]`,
  exportAs: 'uiKitInput',
  host: {
    class: 'input',
    '[attr.id]': 'id',
    '[attr.placeholder]': 'placeholder',
    '[disabled]': 'disabled',
    '[required]': 'required',
    '[attr.readonly]': 'readonly && !_isNativeSelect || null',
    '[attr.aria-describedby]': '_ariaDescribedby || null',
    '[attr.aria-required]': 'required.toString()',
    '(blur)': '_focusChanged(false)',
    '(focus)': '_focusChanged(true)',
    '(input)': '_onInput()'
  }
})
export class UiKitInputComponent implements OnChanges, OnInit, OnDestroy, ControlValueAccessor {
  protected _uid = `ui-kit-input-${nextUniqueId++}`;
  protected _previousNativeValue: any;
  private _inputValueAccessor: { value: any };

  public _ariaDescribedby: string;
  public _isNativeSelect = false;

  protected _id: string;
  public focused: boolean = false;
  protected _disabled = false;
  private _readonly = false;
  protected _required = false;
  protected _type = 'text';

  readonly stateChanges: Subject<void> = new Subject<void>();

  public controlType: string = 'ui-kit-input';
  public autofilled = false;

  propagateChange = (_: any) => {};
  registerOnTouched() {}

  @Input()
  get disabled(): boolean {
    if (this.ngControl && this.ngControl.disabled !== null) {
      return this.ngControl.disabled;
    }

    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);

    /*
     * Browsers may not fire the blur event if the input is disabled too
     * quickly. Reset from here to ensure that the element doesn't become
     * stuck.
     */
    if (this.focused) {
      this.focused = false;
      this.stateChanges.next();
    }
  }

  @Input()
  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value || this._uid;
  }

  @Input() placeholder: string;

  @Input()
  get required(): boolean {
    return this._required;
  }

  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
  }

  @Input()
  get type(): string {
    return this._type;
  }

  set type(value: string) {
    this._type = value || 'text';
    this._validateType();

    /*
     * To ensure that bindings for `type` work, we need to sync the setter
     * with the native property. Textarea elements don't support the type
     * property or attribute.
     */
    if (!this._isTextarea() && getSupportedInputTypes().has(this._type)) {
      (this._elementRef.nativeElement as HTMLInputElement).type = this._type;
    }
  }

  @Input() errorStateMatcher: ErrorStateMatcher;

  @Input()
  get value(): string {
    return this._inputValueAccessor && this._inputValueAccessor.value;
  }

  set value(value: string) {
    if (value !== this.value) {
      this._inputValueAccessor.value = value;
      this.stateChanges.next();
    }
  }

  @Input()
  get readonly(): boolean {
    return this._readonly;
  }

  set readonly(value: boolean) {
    this._readonly = coerceBooleanProperty(value);
  }

  @Input() loading: boolean = false;

  protected _neverEmptyInputTypes = ['date', 'datetime', 'datetime-local', 'month', 'time', 'week'].filter(type =>
    getSupportedInputTypes().has(type)
  );

  constructor(
    protected _elementRef: ElementRef<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    protected _platform: Platform,
    @Optional() @Self() public ngControl: NgControl,
    @Optional() _parentFormGroup: FormGroupDirective,
    public readonly _defaultErrorStateMatcher: ErrorStateMatcher,
    private _autofillMonitor: AutofillMonitor,
    public readonly ngZone: NgZone
  ) {
    const element = this._elementRef.nativeElement;

    this._previousNativeValue = this.value;

    // Force setter to be called in case id was not specified.
    this.id = this.id;

    /*
     * On some versions of iOS the caret gets stuck in the wrong place when
     * holding down the delete key. In order to get around this we need to
     * "jiggle" the caret loose.
     */
    if (_platform.IOS) {
      ngZone.runOutsideAngular(() => {
        _elementRef.nativeElement.addEventListener('keyup', (event: Event) => {
          let el = event.target as HTMLInputElement;
          if (!el.value && !el.selectionStart && !el.selectionEnd) {
            /*
             * Just setting `0, 0` doesn't fix the issue. Setting `1, 1`
             * fixes it for the first time that you type text and then hold
             * delete. Toggling to `1, 1` and then back to `0, 0` seems
             * to completely fix it.
             */
            el.setSelectionRange(1, 1);
            el.setSelectionRange(0, 0);
          }
        });
      });
    }

    this._isNativeSelect = element.nodeName.toLowerCase() === 'select';

    if (this._isNativeSelect) {
      this.controlType = (element as HTMLSelectElement).multiple ? 'mat-native-select-multiple' : 'mat-native-select';
    }
  }

  ngOnInit() {
    if (this._platform.isBrowser) {
      this._autofillMonitor.monitor(this._elementRef.nativeElement).subscribe(event => {
        this.autofilled = event.isAutofilled;
        this.stateChanges.next();
      });
    }
  }

  ngOnChanges() {
    this.stateChanges.next();
  }

  ngOnDestroy() {
    this.stateChanges.complete();

    if (this._platform.isBrowser) {
      this._autofillMonitor.stopMonitoring(this._elementRef.nativeElement);
    }
  }

  focus(options?: FocusOptions): void {
    this._elementRef.nativeElement.focus(options);
  }

  _focusChanged(isFocused: boolean) {
    if (isFocused !== this.focused && (!this.readonly || !isFocused)) {
      this.focused = isFocused;
      this.stateChanges.next();
    }
  }

  _onInput() {
    /*
     * This is a noop function and is used to let Angular know whenever the
     * value changes. Angular will run a new change detection each time the
     * `input` event has been dispatched. Listening to the input event
     * wouldn't be necessary when the input is using the FormsModule or
     * ReactiveFormsModule, because Angular forms also listens to input events.
     */
  }

  // Does some manual dirty checking on the native input `value` property.
  protected _dirtyCheckNativeValue() {
    const newValue = this._elementRef.nativeElement.value;

    if (this._previousNativeValue !== newValue) {
      this._previousNativeValue = newValue;
      this.stateChanges.next();
    }
  }

  protected _validateType() {
    if (MAT_INPUT_INVALID_TYPES.indexOf(this._type) > -1) {
      throw new Error('Input type not supported');
    }
  }

  // Checks whether the input type is one of the types that are never empty.
  protected _isNeverEmpty() {
    return this._neverEmptyInputTypes.indexOf(this._type) > -1;
  }

  // Checks whether the input is invalid based on the native validation.
  protected _isBadInput() {
    // The `validity` property won't be present on platform-server.
    let validity = (this._elementRef.nativeElement as HTMLInputElement).validity;
    return validity && validity.badInput;
  }

  protected _isTextarea() {
    return this._elementRef.nativeElement.nodeName.toLowerCase() === 'textarea';
  }

  get empty(): boolean {
    return !this._isNeverEmpty() && !this._elementRef.nativeElement.value && !this._isBadInput() && !this.autofilled;
  }

  setDescribedByIds(ids: string[]) {
    this._ariaDescribedby = ids.join(' ');
  }

  onContainerClick() {
    if (!this.focused) {
      this.focus();
    }
  }

  writeValue(value: any) {
    if (value !== undefined) {
      this._inputValueAccessor.value = value;
    }
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  handleFocusChanged(isFocused: boolean) {
    if (isFocused !== this.focused && (!this.readonly || !isFocused)) {
      this.focused = isFocused;
      this.stateChanges.next();
    }
  }
}
