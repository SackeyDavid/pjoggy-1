import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UserAuthService } from 'src/app/services/user-auth/user-auth.service';

declare var $: any;

@Component({
  selector: 'app-signup-email',
  templateUrl: './signup-email.component.html',
  styleUrls: ['./signup-email.component.scss']
})
export class SignupEmailComponent implements OnInit, AfterViewInit {

  isSending: boolean = false;
  saved: boolean = false;
  errorMsgs: any = {};
  showPrompt: boolean = false;
  resent: boolean = false;
  isResending: boolean = false;
  
  images = ['../../../../assets/images/samantha-gades-fIHozNWfcvs-unsplash.webp', '../../../../assets/images/pexels-august-de-richelieu-4262413.jpg', '../../../../assets/images/pexels-christina-morillo-1181433.jpg', '../../../../assets/images/pexels-jopwell-2422280.jpg', '../../../../assets/images/pexels-nandhu-kumar-1613240.jpg', '../../../../assets/images/pexels-picha-stock-3894375.jpg']
  image = this.images[this.getRandomInt(0, 5)];


  public registerForm: FormGroup = new FormGroup({});

  constructor(
    private auth: UserAuthService, 
    private router: Router
    ) 
    {
      $("#email").on("mouseout", function(this: HTMLInputElement) {
          
        // alert('Here')
        $(this).value = $(this).val().trim();
        console.log('hI')
       
      
      });

      setTimeout(() => {
        
      setInterval(this.runFunc, 5000)
      
      }, 2000);

   }

   runFunc() {
    let text = document.querySelector(".fancy");
    var styles = window.getComputedStyle(text!,':after')
    var content = styles['content'];
    // let strText = text?.textContent;
    let splitText = content?.split("");
    splitText.splice(0, 1);
    splitText.splice(-1, 1);
    // console.log(splitText)
    content = "";
    text!.innerHTML = "";
    for(let i=0; i < splitText.length; i++) {
      text!.innerHTML += '<span style="color: #fe5104">' +  splitText[i] + '</span>';
    }
    let char = 0
    let timer = setInterval(onTick, 300)

    function onTick() {
      const span = text!.querySelectorAll('span')[char];
      span.classList.add('fade');
      char++;

      if(char === splitText.length) {
        complete();
        
        text!.innerHTML = "";
        return;
      }
     }

     function complete() {
       clearInterval(timer);
      //  timer = ; 
     }
   }

   
 
  ngOnInit(): void {
    document.getElementById('image-bg')?.setAttribute('style', 'background: linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.5)), url('+ this.image + ') no-repeat center center fixed; background-size: cover;')
    // document.getElementById('image-bg')?.('style', 'background-size: cover')

    const emailRegEx = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
    this.registerForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email, Validators.pattern(emailRegEx)]),
      // email: new FormControl('', [Validators.required, Validators.pattern(emailRegEx)]),
      // type: new FormControl('30', Validators.required)
    });

    let text = document.querySelector(".fancy");
    text!.innerHTML = '<span style="color: #fe5104"> events </span>';

  } 
  
  ngAfterViewInit() {

  }

  onSubmit(){
    this.saved = true;
    console.log(this.registerForm.value)

    if (this.registerForm.valid) {
      this.isSending = true;
      this.auth.singupEmail(this.registerForm.value).subscribe(
        res => {
          console.log(res);
          sessionStorage.setItem('registration_id', res.id);        
          if(res.message == 'Ok') this.showPrompt = true;
        },
        err => {
          console.log(err)
          this.isSending = false;
          this.errorMsgs = err.error;
        }
      );
    }
  }

  resend(){
    this.isResending = true;

    this.auth.resendActivation().subscribe(
      res => {
        console.log(res);
        this.isResending = false;
        this.resent = true;
      },
      err => {
        console.log(err)
        this.isResending = false;
        this.errorMsgs = err.error;
      }
    );
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

}
