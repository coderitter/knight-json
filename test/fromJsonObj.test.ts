import { expect } from 'chai'
import 'mocha'
import { fromJsonObj, Instantiator } from '../src/json'

describe('fromJsonObj', function() {
  it('should create an empty object', function() {
    let jsonObj = {}

    let obj = fromJsonObj(jsonObj)

    expect(obj).to.deep.equal({ })
  })

  it('should create the corresponding class', function() {
    let jsonObj = {
      '@class': 'TestClass1',
      a: {
        '@class': 'TestClass2'
      },
      b: [
        { '@class': 'TestClass1' }
      ]
    }

    let obj = fromJsonObj(jsonObj, new TestInstantiator())

    expect(obj).to.be.instanceOf(TestClass1)
    expect(obj.a).to.be.instanceOf(TestClass2)
    expect(obj.b).to.be.instanceOf(Array)
    expect(obj.b.length).to.equal(1)
    expect(obj.b[0]).to.be.instanceOf(TestClass1)
  })

  it('should create the a plain object if the instantiator does not have a corresponding class', function() {
    let jsonObj = {
      '@class': 'TestClass100',
      a: {
        '@class': 'TestClass100'
      },
      b: [
        { '@class': 'TestClass100' }
      ]
    }

    let obj = fromJsonObj(jsonObj, new TestInstantiator())

    expect(obj).to.be.instanceOf(Object)
    expect(obj.b).to.be.instanceOf(Array)
    expect(obj.b.length).to.equal(1)
    expect(obj.b[0]).to.be.instanceOf(Object)
  })

  it('should use fillWithObj method if available', function() {
    let jsonObj = { 
      '@class': 'TestClass3',
      a: 'a'
    }

    let obj = fromJsonObj(jsonObj, new TestInstantiator())

    expect(obj.a).to.equal('aa')
  })

  it('should use fillWithJson method if available', function() {
    let jsonObj = { 
      '@class': 'TestClass4',
      a: 'a'
    }

    let obj = fromJsonObj(jsonObj, new TestInstantiator())

    expect(obj.a).to.equal('aa')
  })

  it('should use fillWithJsonObj method if available', function() {
    let jsonObj = { 
      '@class': 'TestClass5',
      a: 'a'
    }

    let obj = fromJsonObj(jsonObj, new TestInstantiator())

    expect(obj.a).to.equal('aa')
  })

  it('should just return null if the given value was null', function() {
    let obj = fromJsonObj(null)
    expect(obj).to.be.null
  })
})

class TestClass1 {}
class TestClass2 {}

class TestClass3 {
  a!: string
  fillWithObj(jsonObj: any) {
    this.a = jsonObj.a + 'a'
  }
}

class TestClass4 {
  a!: string
  fillWithJson(jsonObj: any) { 
    this.a = jsonObj.a + 'a'
  }
}

class TestClass5 {
  a!: string
  fillWithJsonObj(jsonObj: any) { 
    this.a = jsonObj.a + 'a'
  }
}

class TestInstantiator extends Instantiator {
  'TestClass1' = () => new TestClass1()
  'TestClass2' = () => new TestClass2()
  'TestClass3' = () => new TestClass3()
  'TestClass4' = () => new TestClass4()
  'TestClass5' = () => new TestClass5()
}