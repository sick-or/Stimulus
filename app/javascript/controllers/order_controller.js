import Rails from "@rails/ujs";
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  // static targets = ['form'];

  requiredField(value) {
    return typeof value==='string' && value.trim().length > 0;
  }

  minSizeField(value, minSize) {
    return value.trim().length >= minSize;
  }

  emailValidField(value) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value);
  }

  validateFields(fields) {
    return fields.map((field) => {
      const elem = document.getElementById(field.id)

      let message = field.validator(elem.value)
      const label = document.querySelectorAll(`[for=${elem.id}]`)[0]

      if (!message) {
        label.innerText = field.name
        label.parentNode.classList.remove("field_with_errors")
      } else {
        label.innerText = message
        label.parentNode.classList.add("field_with_errors")
      } 
    })
  }

  submitForm(event) {
    const FIELDS = [
      {name: 'Name' ,id: 'order_name', validator: (value)=>{
          if (!this.requiredField(value)) { return "Name can't be blank" }
          if (!this.minSizeField(value, 3)) { return "Name length can't be shorter than three charactrers" }
          return ''
        }},
        {name: 'Address' ,id: 'order_address', validator: (value)=>{
          if (!this.requiredField(value)) { return "Address can't be blank" }
          if (!this.minSizeField(value, 10)) { return "Address length can't be shorter than ten charactrers" }
          return ''
        }},
        {name: 'Email' ,id: 'order_email', validator: (value)=>{ 
          if (!this.requiredField(value)) { return "Email can't be blank" }
          if (!this.emailValidField(value)) { return "Email must have valild format" }
          return ''
        }},
        {name: 'Pay type' ,id: 'order_pay_type', validator: (value)=>{
          if (!this.requiredField(value)) { return "Pay type must be selected" }
          return ''
        }}
    ]
    event.preventDefault();
    
    this.validateForm(event.target, FIELDS);
  }

  validateForm(target, fields) {    
    let target_field = fields.filter(field=> target.id === field.id)[0]
    target_field ? this.validateFields([target_field]) : fields.map((field) => {this.validateFields(field)})


    let res = fields.map((field) => {
      const elem = document.getElementById(field.id)

      return field.validator(elem.value)
    }).join()

    console.log(res)
    // let isValid = true;

    // let requiredFieldSelectors = 'textarea:required, input:required';
    // let requiredFields = this.formTarget.querySelectorAll(requiredFieldSelectors);

    // requiredFields.forEach((field) => {
    //   if (!field.disabled && !field.value.trim()) {
    //     field.focus();

    //     isValid = false;

    //     return false;
    //   }
    // });
    
    // If we already know we're invalid, just return false
    // if (!isValid) {
    //   return false;
    // }

    // Search for any browser invalidated input fields and focus them
    // let invalidFields = this.formTarget.querySelectorAll('input:invalid');
    
    // invalidFields.forEach((field) => {
    //   if (!field.disabled) {
    //     field.focus();
        
    //     isValid = false;
    //   }
    // });
    
    // return isValid;
}
 
}