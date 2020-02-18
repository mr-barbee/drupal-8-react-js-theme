/**
 * [input description]
 * @type {[type]}
 */
export default class validation {
  constructor(input) {
    this.input = input
    this.errors = {}
  }

  validateEmail = fields => {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    for (const key of Object.keys(fields)) {
      if (this.input[key] == undefined || emailRegex.test(this.input[key].toLowerCase()) == false) {
        this.errors[key] = `${fields[key]} is not a valid email address.`
      }
    }
  }

  checkRequired = fields => {
    for (const key of Object.keys(fields)) {
      if (this.input[key] == undefined || this.input[key].length === 0) {
        this.errors[key] = `${fields[key]} is required.`
      }
    }
  }

  validateZip = (fields, linkedField) => {
    const state = this.input[linkedField]
    for (const key of Object.keys(fields)) {
      // Ensure we don't parse strings starting with 0 as octal values
      const zipcode = parseInt(this.input[key], 10)
      let st
      // Ensure param is a string to prevent unpredictable parsing results
      if (this.input[key] == undefined || typeof this.input[key] !== 'string') {
        this.errors[key] = `${fields[key]} has an invalid input.`
      } else if (this.input[key] == undefined || this.input[key].length !== 5) {
        // Ensure we have exactly 5 characters to parse
        this.errors[key] = `${fields[key]} must pass a 5-digits.`
      } else {
        if (zipcode >= 35000 && zipcode <= 36999) {
          st = 'AL'
        } else if (zipcode >= 99500 && zipcode <= 99999) {
          st = 'AK'
        } else if (zipcode >= 85000 && zipcode <= 86999) {
          st = 'AZ'
        } else if (zipcode >= 71600 && zipcode <= 72999) {
          st = 'AR'
        } else if (zipcode >= 90000 && zipcode <= 96699) {
          st = 'CA'
        } else if (zipcode >= 80000 && zipcode <= 81999) {
          st = 'CO'
        } else if (zipcode >= 6000 && zipcode <= 6999) {
          st = 'CT'
        } else if (zipcode >= 19700 && zipcode <= 19999) {
          st = 'DE'
        } else if (zipcode >= 32000 && zipcode <= 34999) {
          st = 'FL'
        } else if (zipcode >= 30000 && zipcode <= 31999) {
          st = 'GA'
        } else if (zipcode >= 96700 && zipcode <= 96999) {
          st = 'HI'
        } else if (zipcode >= 83200 && zipcode <= 83999) {
          st = 'ID'
        } else if (zipcode >= 60000 && zipcode <= 62999) {
          st = 'IL'
        } else if (zipcode >= 46000 && zipcode <= 47999) {
          st = 'IN'
        } else if (zipcode >= 50000 && zipcode <= 52999) {
          st = 'IA'
        } else if (zipcode >= 66000 && zipcode <= 67999) {
          st = 'KS'
        } else if (zipcode >= 40000 && zipcode <= 42999) {
          st = 'KY'
        } else if (zipcode >= 70000 && zipcode <= 71599) {
          st = 'LA'
        } else if (zipcode >= 3900 && zipcode <= 4999) {
          st = 'ME'
        } else if (zipcode >= 20600 && zipcode <= 21999) {
          st = 'MD'
        } else if (zipcode >= 1000 && zipcode <= 2799) {
          st = 'MA'
        } else if (zipcode >= 48000 && zipcode <= 49999) {
            st = 'MI'
        } else if (zipcode >= 55000 && zipcode <= 56999) {
          st = 'MN'
        } else if (zipcode >= 38600 && zipcode <= 39999) {
          st = 'MS'
        } else if (zipcode >= 63000 && zipcode <= 65999) {
          st = 'MO'
        } else if (zipcode >= 59000 && zipcode <= 59999) {
          st = 'MT'
        } else if (zipcode >= 27000 && zipcode <= 28999) {
          st = 'NC'
        } else if (zipcode >= 58000 && zipcode <= 58999) {
          st = 'ND'
        } else if (zipcode >= 68000 && zipcode <= 69999) {
          st = 'NE'
        } else if (zipcode >= 88900 && zipcode <= 89999) {
          st = 'NV'
        } else if (zipcode >= 3000 && zipcode <= 3899) {
          st = 'NH'
        } else if (zipcode >= 7000 && zipcode <= 8999) {
          st = 'NJ'
        } else if (zipcode >= 87000 && zipcode <= 88499) {
          st = 'NM'
        } else if (zipcode >= 10000 && zipcode <= 14999) {
          st = 'NY'
        } else if (zipcode >= 43000 && zipcode <= 45999) {
          st = 'OH'
        } else if (zipcode >= 73000 && zipcode <= 74999) {
          st = 'OK'
        } else if (zipcode >= 97000 && zipcode <= 97999) {
          st = 'OR'
        } else if (zipcode >= 15000 && zipcode <= 19699) {
          st = 'PA'
        } else if (zipcode >= 300 && zipcode <= 999) {
          st = 'PR'
        } else if (zipcode >= 2800 && zipcode <= 2999) {
          st = 'RI'
        } else if (zipcode >= 29000 && zipcode <= 29999) {
          st = 'SC'
        } else if (zipcode >= 57000 && zipcode <= 57999) {
          st = 'SD'
        } else if (zipcode >= 37000 && zipcode <= 38599) {
          st = 'TN'
        } else if ( (zipcode >= 75000 && zipcode <= 79999) || (zipcode >= 88500 && zipcode <= 88599) ) {
          st = 'TX'
        } else if (zipcode >= 84000 && zipcode <= 84999) {
          st = 'UT'
        } else if (zipcode >= 5000 && zipcode <= 5999) {
          st = 'VT'
        } else if (zipcode >= 22000 && zipcode <= 24699) {
          st = 'VA'
        } else if (zipcode >= 20000 && zipcode <= 20599) {
          st = 'DC'
        } else if (zipcode >= 98000 && zipcode <= 99499) {
          st = 'WA'
        } else if (zipcode >= 24700 && zipcode <= 26999) {
          st = 'WV'
        } else if (zipcode >= 53000 && zipcode <= 54999) {
          st = 'WI'
        } else if (zipcode >= 82000 && zipcode <= 83199) {
          st = 'WY'
        } else {
          st = false
        }
        if (st == false || st != state) {
          this.errors[key] = `${fields[key]} does not match the state.`
        }
      }
    }
  }

  getErrors = () => this.errors

}
