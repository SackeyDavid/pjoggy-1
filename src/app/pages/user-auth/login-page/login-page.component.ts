import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UserAuthService } from '../../../services/user-auth/user-auth.service'

declare var $: any;

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  isSending: boolean = false;
  saved: boolean = false;
  errorMsgs: any;

  loginForm: FormGroup = new FormGroup({});

  images = ['../../../../assets/images/samantha-gades-fIHozNWfcvs-unsplash.webp', '../../../../assets/images/pexels-august-de-richelieu-4262413.jpg', '../../../../assets/images/pexels-christina-morillo-1181433.jpg', '../../../../assets/images/pexels-jopwell-2422280.jpg', '../../../../assets/images/pexels-nandhu-kumar-1613240.jpg', '../../../../assets/images/pexels-picha-stock-3894375.jpg']
  image = this.images[this.getRandomInt(0, 5)]

  constructor(private auth: UserAuthService, private router: Router) 
  {
    $("#floatingInput").on("keypress", function(this: HTMLInputElement) {
          
      alert('Here')
      $(this).value = $(this).val().trim();
      console.log('hI')
     
    
    });
    
        
      

   }

   runFunc() {
    let text = document.querySelector(".fancy");
    if (text) {
      
      var styles = window.getComputedStyle(text!,':after')
      var content = styles['content'];
      // let strText = text?.textContent;
      let splitText = content?.split("");
      splitText.splice(0, 1);
      splitText.splice(-1, 1);
      // splitText.(' ', '')
      // console.log(splitText);
      content = "";
      text!.innerHTML = "";
      for(let i= 0; i < splitText!.length; i++) {
        if(splitText![i] === " ") splitText![i] = '&nbsp;';
        text!.innerHTML += '<span style="color: #fe5104">' +  splitText![i] + '</span>';
      }
      let char = 0;
      let timer = setInterval(onTick, 50);

      function onTick() {
        if(text!.querySelectorAll('span') !== null) {
          let span = text!.querySelectorAll('span')[char];
          if(span) span.classList.add('text-flow');
          char++;

          if(char === splitText!.length) {
            complete();
            
            // text!.innerHTML = "";
            return;
          }
        } 
      }

      function complete() {
        clearInterval(timer);
          
      }

    }
      
   }

   

  ngOnInit(): void {
    document.getElementById('image-bg')?.setAttribute('style', 'background: linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.5)), url('+ this.image + ') no-repeat center center fixed; background-size: cover;')

    const emailRegEx = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    });
    this.loginForm.value.email = this.loginForm.value.email.replace(/\s/g,'');

    setInterval(this.runFunc, 5000)
      

  }

  onSubmit(){
    this.loginForm.value.email = this.loginForm.value.email.replace(/\s/g,'')
    console.log(this.loginForm.value);
    console.log(this.loginForm.controls)
    this.saved = true;

    if (this.loginForm.valid) {
      this.isSending = true;
      this.auth.loginUser(this.loginForm.value)
        .subscribe(
          res => {
            console.log(res);

            if (res.phone) {
              sessionStorage.setItem('user_id', res.id);
              sessionStorage.setItem('user_phone', res.phone);
              this.router.navigateByUrl('/phone_authentication');
            } 
            else if (res.token) {
              sessionStorage.setItem('user_id', res.user.id);
              sessionStorage.setItem('x_auth_token', res.token);
              sessionStorage.setItem('events_user_id', res.user.id);
              sessionStorage.setItem('events_user_name', res.user.name);
              sessionStorage.setItem('events_user_email', res.user.email);
              // this.router.navigateByUrl('/manage-community');
              window.open('/manage-community', "_self");
            }
          },
          err => {
            console.log(err);
            this.isSending = false;
            this.errorMsgs = err.error;
          }
        );
    }
  }

  facebookSignUp() {
    window.location.href = this.auth.facebookAuthUrl;
  }
  
  googleSignUp() {
    window.location.href = this.auth.googleAuthUrl;
  }

  getRandomInt(min: any, max: any) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  gotoRegister() {
    window.location.href = '/register';
  }


}
