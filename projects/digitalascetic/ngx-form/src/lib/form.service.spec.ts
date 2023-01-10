import {FormControl, FormGroup, FormArray, UntypedFormGroup, UntypedFormControl} from '@angular/forms';
import * as moment from 'moment-mini';
import {PropertyAccessorMapper, PropertyNameMapper} from '@digitalascetic/ngx-object-transformer';
import {FormService} from './form.service';
import {FormField} from './form.field';
import {FormFragment} from './form.fragment';
import {FormPartType} from './form.part.type';
import {FormServiceConfiguration} from './form.service.configuration';
import {TestClass} from './testclass/test.class';
import {TestDescription} from './testclass/test.description';
import {TestDecoratorClass} from './testclass/test.decorator.class';
import {ChildTestClass} from './testclass/child.test.class';

describe('FormService tests', () => {

  let propMapper: PropertyNameMapper = new PropertyAccessorMapper();
  let configuration = new FormServiceConfiguration(propMapper);
  let formService: FormService = new FormService(configuration);

  it('should give a form for simple string', () => {


    let ctrl = formService.getControl('test');
    let ctrlValue = ctrl.value;

    expect(ctrl instanceof FormControl).toBeTruthy();
    expect(ctrl.value).toBe('test');

  });

  it('should give form for simple object', () => {

    let testDesc = new TestDescription('bla bla');

    let ctrl = formService.getControl(testDesc);

    expect(ctrl instanceof FormGroup).toBeTruthy();
    expect(ctrl.value).toBeDefined();
    expect(ctrl.value instanceof Object).toBeTruthy();
    expect(ctrl.value.text).toBeDefined();
    expect(ctrl.value.text).toBe('bla bla');

  });

  it('should handle correctly null date properties', () => {


    let testObj = new TestClass('testObject', null, null);

    let ctrl = formService.getControl(testObj);

    expect(ctrl instanceof FormGroup).toBeTruthy();
    expect((<FormGroup>ctrl).controls).toBeDefined();
    expect((<FormGroup>ctrl).controls['name']).toBeDefined();
    expect((<FormGroup>ctrl).controls['startDate']).toBeDefined();
    expect((<FormGroup>ctrl).controls['startDate'] instanceof FormControl).toBeTruthy();
    expect((<FormGroup>ctrl).controls['description']).toBeDefined();
    expect((<FormGroup>ctrl).controls['description'] instanceof FormGroup).toBeTruthy();

    expect(ctrl.value).toBeDefined();
    expect(ctrl.value.startDate).toBeDefined();
    expect(ctrl.value.name).toBe('testObject');
    expect(ctrl.value.startDate).toBeDefined();
    expect(ctrl.value.startDate).toBe(null);
    expect(ctrl.value.description).toBeDefined();
    expect(ctrl.value.description.text).toBeDefined();
    expect(ctrl.value.description.text).toBe(null);

  });

  it('should give form for composed object', () => {

    let testDesc = new TestDescription('bla bla');
    let startDate: Date = moment('2016-01-01').toDate();

    let testObj = new TestClass('testObject', testDesc, startDate);

    let ctrl = formService.getControl(testObj);

    expect(ctrl instanceof FormGroup).toBeTruthy();
    expect((<FormGroup>ctrl).controls).toBeDefined();
    expect((<FormGroup>ctrl).controls['name']).toBeDefined();
    expect((<FormGroup>ctrl).controls['startDate']).toBeDefined();
    expect((<FormGroup>ctrl).controls['startDate'] instanceof FormControl).toBeTruthy();
    expect((<FormGroup>ctrl).controls['description']).toBeDefined();
    expect((<FormGroup>ctrl).controls['description'] instanceof FormGroup).toBeTruthy();

    expect(ctrl.value).toBeDefined();
    expect(ctrl.value.startDate).toBeDefined();
    expect(ctrl.value.name).toBe('testObject');
    expect(ctrl.value.startDate).toBeDefined();
    expect(ctrl.value.startDate).toBe(startDate);
    expect(ctrl.value.description).toBeDefined();
    expect(ctrl.value.description.text).toBeDefined();
    expect(ctrl.value.description.text).toBe('bla bla');

  });

  it('should handle correctly composed objects with nulls', () => {

    let testDesc = null;
    let startDate: Date = moment('2016-01-01').toDate();

    let testObj = new TestClass('testObject', testDesc, startDate);

    let ctrl = formService.getControl(testObj);

    expect(ctrl instanceof FormGroup).toBeTruthy();
    expect((<FormGroup>ctrl).controls).toBeDefined();
    expect((<FormGroup>ctrl).controls['name']).toBeDefined();
    expect((<FormGroup>ctrl).controls['name'] instanceof FormControl).toBeTruthy();
    expect((<FormGroup>ctrl).controls['startDate']).toBeDefined();
    expect((<FormGroup>ctrl).controls['startDate'] instanceof FormControl).toBeTruthy();
    expect((<FormGroup>ctrl).controls['description']).toBeDefined();
    expect((<FormGroup>ctrl).controls['description'] instanceof FormGroup).toBeTruthy();
    expect((<FormGroup>(<FormGroup>ctrl).controls['description']).controls['text']).toBeDefined();
    expect((<FormGroup>(<FormGroup>ctrl).controls['description']).controls['text'] instanceof FormControl).toBeTruthy();

    expect(ctrl.value).toBeDefined();
    expect(ctrl.value.name).toBeDefined();
    expect(ctrl.value.name).toBe('testObject');
    expect(ctrl.value.startDate).toBeDefined();
    expect(ctrl.value.startDate).toBe(startDate);
    expect(ctrl.value.description).toBeDefined();
    expect(ctrl.value.description.text).toBeDefined();
    expect(ctrl.value.description.text).toBe(null);

  });

  it('should follow decorator directives', () => {

    let testDesc = new TestDescription('bla bla', 999);
    let testDesc2 = new TestDescription('bla bla 2', 1000);
    let testDecoration = new TestDecoratorClass(testDesc, 'not showed', 23, testDesc2);

    let ctrl = formService.getControl(testDecoration);

    expect(ctrl instanceof FormGroup).toBeTruthy();
    expect((<FormGroup>ctrl).controls).toBeDefined();
    expect((<FormGroup>ctrl).controls['inForm']).toBeDefined();
    expect((<FormGroup>ctrl).controls['inForm'] instanceof FormControl).toBeTruthy();
    expect((<FormGroup>ctrl).controls['notInForm']).not.toBeDefined();
    expect((<FormGroup>ctrl).controls['description']).toBeDefined();
    expect((<FormGroup>ctrl).controls['description'] instanceof FormGroup).toBeTruthy();
    expect((<FormGroup>(<FormGroup>ctrl).controls['description']).controls).toBeDefined();
    expect((<FormGroup>(<FormGroup>ctrl).controls['description']).controls['id'] instanceof FormControl).toBeTruthy();
    expect((<FormGroup>(<FormGroup>ctrl).controls['description']).controls['text']).not.toBeDefined();
    expect((<FormGroup>ctrl).controls['description2']).toBeDefined();
    expect((<FormGroup>ctrl).controls['description2'] instanceof FormGroup).toBeTruthy();
    expect((<FormGroup>(<FormGroup>ctrl).controls['description2']).controls['id'] instanceof FormControl).toBeTruthy();

    expect(ctrl.value).toBeDefined();
    expect(ctrl.value.inForm).toBeDefined();
    expect(ctrl.value.inForm).toBe(23);
    expect(ctrl.value.notInForm).not.toBeDefined();
    expect(ctrl.value.description).toBeDefined();
    expect(ctrl.value.description.id).toBeDefined();
    expect(ctrl.value.description.id).toBe(999);
    expect(ctrl.value.description.text).not.toBeDefined();

  });

  it('should support arrays', () => {

    let testDesc1 = new TestDescription('bla bla 1');
    let testDesc2 = new TestDescription('bla bla 2');
    let testDesc3 = new TestDescription('bla bla 3');

    let array: Array<TestDescription> = [];

    array.push(testDesc1);
    array.push(testDesc2);
    array.push(testDesc3);

    let ctrl = formService.getControl(array);

    expect(ctrl instanceof FormArray).toBeTruthy();
    expect((<FormGroup>ctrl).controls).toBeDefined();
    expect((<FormGroup>ctrl).controls[0]).toBeDefined();
    expect((<FormGroup>ctrl).controls[0] instanceof FormGroup).toBeTruthy();
    expect((<FormArray>(<FormGroup>ctrl).controls[0]).controls['text']).toBeDefined();
    expect((<FormArray>(<FormGroup>ctrl).controls[0]).controls['text'] instanceof FormControl).toBeTruthy();
    expect((<FormGroup>ctrl).controls[1]).toBeDefined();
    expect((<FormGroup>ctrl).controls[1] instanceof FormGroup).toBeTruthy();
    expect((<FormArray>(<FormGroup>ctrl).controls[1]).controls['text']).toBeDefined();
    expect((<FormArray>(<FormGroup>ctrl).controls[1]).controls['text'] instanceof FormControl).toBeTruthy();
    expect((<FormGroup>ctrl).controls[2]).toBeDefined();
    expect((<FormGroup>ctrl).controls[2] instanceof FormGroup).toBeTruthy();
    expect((<FormArray>(<FormGroup>ctrl).controls[2]).controls['text']).toBeDefined();
    expect((<FormArray>(<FormGroup>ctrl).controls[2]).controls['text'] instanceof FormControl).toBeTruthy();
    expect((<FormGroup>ctrl).controls[3]).not.toBeDefined();


    expect(ctrl.value).toBeDefined();
    expect(ctrl.value[0]).toBeDefined();
    expect(ctrl.value[1]).toBeDefined();
    expect(ctrl.value[2]).toBeDefined();
    expect(ctrl.value[0].text).toBeDefined();
    expect(ctrl.value[0].text).toBe('bla bla 1');
    expect(ctrl.value[1].text).toBeDefined();
    expect(ctrl.value[1].text).toBe('bla bla 2');
    expect(ctrl.value[2].text).toBeDefined();
    expect(ctrl.value[2].text).toBe('bla bla 3');
    expect(ctrl.value[3]).not.toBeDefined();

  });

  it('should work with Function', () => {


    let ctrl = formService.getControl(TestClass, {name: 'test', description: {id: 97}});

    expect(ctrl).toBeDefined();
    expect(ctrl instanceof FormGroup).toBeTruthy();
    expect((<FormGroup>ctrl).controls['name']).toBeDefined();
    expect((<FormGroup>ctrl).controls['name'] instanceof FormControl).toBeTruthy();
    expect((<FormGroup>ctrl).controls['description']).toBeDefined();
    expect((<FormGroup>ctrl).controls['description'] instanceof FormGroup).toBeTruthy();
    expect((<FormGroup>(<FormGroup>ctrl).controls['description']).controls['id']).toBeDefined();
    expect((<FormGroup>(<FormGroup>ctrl).controls['description']).controls['id'] instanceof FormControl).toBeDefined();

    expect(ctrl.value).toBeDefined();
    expect(ctrl.value.name).toBeDefined();
    expect(ctrl.value.name).toBe('test');
    expect(ctrl.value.description).toBeDefined();
    expect(ctrl.value.description.id).toBe(97);

  });

  it('creates simple custom objects from values', () => {

    let plainTestDesc = {id: 80, text: 'description text'};
    let testDesc: TestDescription = formService.getObject(plainTestDesc, TestDescription);

    expect(testDesc).toBeDefined();
    expect(testDesc instanceof TestDescription).toBeTruthy();
    expect(testDesc.id).toBe(80);
    expect(testDesc.text).toBe('description text');

  });

  it('creates composed custom objects from values', () => {

    let plainTestDesc = {id: 80, text: 'description text'};
    let plainTest = {name: 'atest', description: plainTestDesc, startDate: moment('2016-01-01').toDate()};

    let test: TestClass = formService.getObject(plainTest, TestClass);

    expect(test).toBeDefined();
    expect(test instanceof TestClass).toBeTruthy();
    expect(test.startDate).toBeDefined();
    expect(test.startDate instanceof Date).toBeTruthy();
    expect(test.description).toBeDefined();
    expect(test.description instanceof TestDescription).toBeTruthy();
    expect(test.description).toBeDefined();
    expect(test.description.text).toBe('description text');
    expect(test.description.id).toBeDefined();
    expect(test.description.id).toBe(80);

  });

  it('creates composed custom objects from values and preserve type on replaced object', () => {

    let plainTestDesc = {id: 80, text: 'description text'};
    let plainTestDecorator = {description: plainTestDesc, notInForm: 'no in form', inForm: 'in form'};

    let test: TestClass = formService.getObject(plainTestDecorator, TestDecoratorClass);

    expect(test).toBeDefined();
    expect(test instanceof TestDecoratorClass).toBeTruthy();
    expect(test.description).toBeDefined();
    expect(test.description instanceof TestDescription).toBeTruthy();
    expect(test.description).toBeDefined();
    expect(test.description.text).not.toBeDefined();
    expect(test.description.id).toBeDefined();
    expect(test.description.id).toBe(80);

  });

  it('should set to null replaced properties where replaced property is null', () => {

    let plainTestDesc = {id: null, text: 'description text'};
    let plainTestDecorator = {inForm: 'in form value', description: plainTestDesc};

    let testDecorator: TestDecoratorClass = formService.getObject(plainTestDecorator, TestDecoratorClass);

    expect(testDecorator).toBeDefined();
    expect(testDecorator instanceof TestDecoratorClass).toBeTruthy();
    expect(testDecorator.inForm).toBeDefined();
    expect(testDecorator.inForm).toBe('in form value');
    expect(testDecorator.notInForm).not.toBeDefined();
    expect(testDecorator.description).toBeUndefined();

  });

  it('should set to false object property when property is false', () => {
    let plainTestDesc = {text: 'dasdadsadas', active: false};
    let testDesc: TestDescription = formService.getObject(plainTestDesc, TestDescription);

    expect(testDesc).toBeDefined();
    expect(testDesc instanceof TestDescription).toBeTruthy();
    expect(testDesc.active).toBe(false);
  });

  it('should manage constructor parameters', () => {
    let plainTest = {name: 'testClass1', description: 'description text', 'startDate': new Date()};
    let testClass: ChildTestClass = formService.getObject(plainTest, ChildTestClass, ['testClass1', 'description text', new Date()]);

    expect(testClass).toBeDefined();
    expect(testClass instanceof ChildTestClass).toBeTruthy();
    expect(testClass.testClass instanceof TestClass).toBeTruthy();
    expect(testClass.testClass.name).toBe('testClass1');
    expect(testClass.testClass.description instanceof TestDescription).toBeTruthy();
    expect(testClass.testClass.description.text).toBe('description text');
    expect(testClass.testClass.status).toBe(TestClass.STATUS_NOT_STARTED);
    expect(testClass.testClass.status).not.toBe(TestClass.STATUS_STARTED);

  });

  it('should return simple single modified value', () => {

    let ctrl = new FormControl('test');
    ctrl.setValue('test changed');
    ctrl.markAsDirty();

    let formService = new FormService();

    let values = formService.getModifiedValues(ctrl);

    expect(values).toBeDefined();
    expect(values).toBe('test changed');


  });

  it('should return primitive array modified value', () => {

    let ctrl1 = new FormControl('test1');
    let ctrl2 = new FormControl('test2');
    let ctrl3 = new FormControl('test3');
    let ctrlArr = new FormArray([ctrl1, ctrl2, ctrl3]);
    ctrl1.setValue('test changed');
    ctrl1.markAsDirty();

    let formService = new FormService();

    let values = formService.getModifiedValues(ctrlArr);

    expect(values).toBeDefined();
    expect(values).toEqual(['test changed', 'test2', 'test3']);

    let values2 = formService.getModifiedValues(ctrlArr, {includeEntireArray: false});

    expect(values2).toBeDefined();
    expect(values2).toEqual(['test changed']);

  });

  it('should return modified values from FormGroup', () => {

    let ctrl1 = new FormControl('test1');
    let ctrl2 = new FormControl('test2');
    let ctrl3 = new FormControl('test3');
    let ctrlArr = new FormArray([ctrl1, ctrl2, ctrl3]);
    let nameCtrl = new FormControl('name');
    let grpCtrl1 = new FormGroup({name: nameCtrl, tests: ctrlArr, id: new FormControl(1)});
    let mainCtrl = new FormGroup({ctrl: grpCtrl1, test: new FormControl('test'), id: new FormControl(90)});

    ctrl1.setValue('test changed');
    ctrl1.markAsDirty();

    nameCtrl.setValue('name changed');
    nameCtrl.markAsDirty();

    let formService = new FormService();

    let values = formService.getModifiedValues(mainCtrl);

    expect(values).toBeDefined();
    expect(values).toEqual({ctrl: {name: 'name changed', tests: ['test changed', 'test2', 'test3']}});

    let values2 = formService.getModifiedValues(mainCtrl, {includeEntireArray: false});

    expect(values2).toBeDefined();
    expect(values2).toEqual({ctrl: {name: 'name changed', tests: ['test changed']}});


    let values3 = formService.getModifiedValues(mainCtrl, {alwaysIncludeProps: ['id']});

    expect(values3).toBeDefined();
    expect(values3).toEqual({
      id: 90,
      ctrl: {id: 1, name: 'name changed', tests: ['test changed', 'test2', 'test3']}
    });

  });

  it('should update values of an array from a FormArray control', () => {

    let testClassArray = new Array<TestClass>();
    let testDesc1 = new TestDescription('desc1');
    let testDesc2 = new TestDescription('desc2');
    let testDesc3 = new TestDescription('desc3');
    let testClass1 = new TestClass('testClass1', testDesc1, new Date());
    let testClass2 = new TestClass('testClass2', testDesc2, new Date());
    let testClass3 = new TestClass('testClass3', testDesc3, new Date());
    testClassArray.push(testClass1, testClass2, testClass3);

    let configuration = new FormServiceConfiguration(new PropertyAccessorMapper());
    let formService = new FormService(configuration);

    let formArray: FormArray = <FormArray>formService.getControl(testClassArray);

    expect((<FormGroup>(<FormGroup>formArray.controls[1]).controls['description']).controls['text'].value).toBe('desc2');
    expect(testClassArray[1].description.text).toBeDefined();
    expect(testClassArray[1].description.text).toBe('desc2');

    formArray.at(1).get('description').get('text').setValue('newDesk');
    formArray.at(1).get('description').get('text').markAsDirty();

    const newStartDateValue = new Date('2018-06-12');

    formArray.at(1).get('startDate').patchValue(newStartDateValue);
    formArray.at(1).get('startDate').markAsDirty();

    expect((<FormGroup>(<FormGroup>formArray.controls[1]).controls['description']).controls['text'].value).toBeDefined();
    expect((<FormGroup>(<FormGroup>formArray.controls[1]).controls['description']).controls['text'].value).toBe('newDesk');
    expect(testClassArray[1].description.text).toBeDefined();
    expect(testClassArray[1].description.text).toBe('desc2');

    formService.updateFromControl(testClassArray, formArray);

    expect(testClassArray[1].description.text).toBeDefined();
    expect(testClassArray[1].startDate).toBeDefined();
    expect(testClassArray[1].startDate).toEqual(newStartDateValue);
    expect(testClassArray[0].description.text).toBe('desc1');
    expect(testClassArray[1].description.text).toBe('newDesk');
    expect(testClassArray[2].description.text).toBe('desc3');


  });

  it('should correctly create control from FormFragment', () => {

    let username = new FormField('username', 'Username');
    username.defaultValue = 'test ';
    let password = new FormField('password', 'Password', FormPartType.FIELD_PASSWORD);
    let age = new FormField('age', 'Age');
    age.defaultValue = 30;
    let formFrag = new FormFragment();
    formFrag.insertPart(username, password, age);

    let ctrl: FormGroup = <FormGroup>formFrag.getControl();

    expect(ctrl).toBeDefined();
    expect(ctrl instanceof FormGroup).toBeTruthy();
    expect(ctrl.controls).toBeDefined();
    expect(ctrl.controls['username']).toBeDefined();
    expect(ctrl.controls['username'] instanceof FormControl).toBeTruthy();
    expect(ctrl.controls['password']).toBeDefined();
    expect(ctrl.controls['password'] instanceof FormControl).toBeTruthy();
    expect(ctrl.controls['age']).toBeDefined();
    expect(ctrl.controls['age'] instanceof FormControl).toBeTruthy();
    expect(ctrl.controls['age'].value).toEqual(30);


  });

  it('should correctly create control for FormFragment with grouped form parts', () => {

    let username = new FormField('username', 'Username');
    username.defaultValue = 'test ';
    let password = new FormField('password', 'Password', FormPartType.FIELD_PASSWORD);
    let age = new FormField('age', 'Age');
    age.defaultValue = 27;
    let groupedFrag = new FormFragment();
    groupedFrag.insertPart(username, password);
    let rootFrag = new FormFragment();
    rootFrag.insertPart(groupedFrag, age);

    let ctrl: FormGroup = <FormGroup>rootFrag.getControl();

    expect(ctrl).toBeDefined();
    expect(ctrl instanceof FormGroup).toBeTruthy();
    expect(ctrl.controls).toBeDefined();
    expect(ctrl.controls['username']).toBeDefined();
    expect(ctrl.controls['username'] instanceof FormControl).toBeTruthy();
    expect(ctrl.controls['password']).toBeDefined();
    expect(ctrl.controls['password'] instanceof FormControl).toBeTruthy();
    expect(ctrl.controls['age']).toBeDefined();
    expect(ctrl.controls['age'] instanceof FormControl).toBeTruthy();
    expect(ctrl.controls['age'].value).toEqual(27);

  });

  it('should correctly create control for FormFragment with grouped keyed form parts', () => {

    let username = new FormField('username', 'Username');
    username.defaultValue = 'test ';
    let password = new FormField('password', 'Password', FormPartType.FIELD_PASSWORD);
    let age = new FormField('age', 'Age');
    age.defaultValue = 27;
    let groupedFrag = new FormFragment(FormPartType.GROUP_DEFAULT, 'credentials', 'Credentials');
    groupedFrag.insertPart(username, password);
    let rootFrag = new FormFragment();
    rootFrag.insertPart(groupedFrag, age);

    let ctrl: FormGroup = <FormGroup>rootFrag.getControl();

    expect(ctrl).toBeDefined();
    expect(ctrl instanceof FormGroup).toBeTruthy();
    expect(ctrl.controls).toBeDefined();
    expect(ctrl.controls['credentials']).toBeDefined();
    expect(ctrl.controls['credentials'] instanceof FormGroup).toBeTruthy();
    expect(ctrl.controls['credentials']['controls']['username']).toBeDefined();
    expect(ctrl.controls['credentials']['controls']['username'] instanceof FormControl).toBeTruthy();
    expect(ctrl.controls['credentials']['controls']['password']).toBeDefined();
    expect(ctrl.controls['credentials']['controls']['password'] instanceof FormControl).toBeTruthy();
    expect(ctrl.controls['age']).toBeDefined();
    expect(ctrl.controls['age'] instanceof FormControl).toBeTruthy();
    expect(ctrl.controls['age'].value).toEqual(27);

  });

  it('should correctly create control following decorator @ControlReplace asFormControlIfNull if hasn\'t property value', () => {

    let ctrl = formService.getControl(TestDecoratorClass);

    expect(ctrl instanceof FormGroup).toBeTruthy();
    expect((<FormGroup>ctrl).controls).toBeDefined();
    expect((<FormGroup>ctrl).controls['inForm']).toBeDefined();
    expect((<FormGroup>ctrl).controls['inForm'] instanceof FormControl).toBeTruthy();
    expect((<FormGroup>ctrl).controls['notInForm']).not.toBeDefined();
    expect((<FormGroup>ctrl).controls['description']).not.toBeDefined();
    expect((<FormGroup>ctrl).controls['description2']).toBeDefined();
    expect((<FormGroup>ctrl).controls['description2'] instanceof FormControl).toBeTruthy();
    expect((<FormGroup>ctrl).controls['child']).toBeDefined();
    expect((<FormGroup>ctrl).controls['child'] instanceof FormControl).toBeTruthy();

  });

  it('creates composed custom objects from control and preserve type on replaced object', () => {

    let testDesc = new TestDescription('bla bla', 999);
    let testDesc2 = new TestDescription('bla bla 2');
    let child = new ChildTestClass('testClass1', 'description text', new Date(), 23);
    let testDecoration = new TestDecoratorClass(testDesc, 'not showed', 23, testDesc2);
    testDecoration.child = child;

    let ctrl = formService.getControl(testDecoration);

    let test: TestDecoratorClass = formService.getObject(ctrl.value, TestDecoratorClass);

    expect(test).toBeDefined();
    expect(test instanceof TestDecoratorClass).toBeTruthy();
    expect(test.description3).not.toBeDefined();
    expect(test.inForm).toBeDefined();
    expect(test.inForm).toBe(23);
    expect(test.notInForm).not.toBeDefined();
    expect(test.description instanceof TestDescription).toBeTruthy();
    expect(test.description).toBeDefined();
    expect(test.description.text).not.toBeDefined();
    expect(test.description.id).toBeDefined();
    expect(test.description.id).toBe(999);
    expect(test.description2).toBeDefined();
    expect(test.description2.id).not.toBeDefined();
    expect(test.description2.text).toBeDefined();
    expect(test.description2.text).toBe('bla bla 2');
    expect(test.child).toBeDefined();
    expect(test.child.childType).toBeDefined();
    expect(test.child.childType).toBe(23);
  });

  it('should correctly patch FormGroup from value', () => {

    const group = new FormGroup({
      'prop1': new FormControl(),
      'prop2': new FormControl(),
      'prop3': new FormControl()
    });

    formService.patchValue(group, {prop1: 'test', prop3: 'test'});

    expect(group.get('prop1')).toBeDefined();
    expect(group.get('prop2')).toBeDefined();
    expect(group.get('prop3')).toBeDefined();
    expect(group.get('prop1').value).toEqual('test');
    expect(group.get('prop3').value).toEqual('test');
    expect(group.get('prop2').value).toBeNull();
  });

  it('should correctly patch UntypedFormGroup from value', () => {

    const group = new UntypedFormGroup({
      'prop1': new UntypedFormControl(),
      'prop2': new UntypedFormControl(),
      'prop3': new FormControl()
    });

    formService.patchValue(group, {prop1: 'test', prop3: 'test'});

    expect(group.get('prop1')).toBeDefined();
    expect(group.get('prop2')).toBeDefined();
    expect(group.get('prop3')).toBeDefined();
    expect(group.get('prop1').value).toEqual('test');
    expect(group.get('prop3').value).toEqual('test');
    expect(group.get('prop2').value).toBeNull();
  });
});


