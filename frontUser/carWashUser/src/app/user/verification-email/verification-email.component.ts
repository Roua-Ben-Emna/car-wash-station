import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-verification-email',
  templateUrl: './verification-email.component.html',
  styleUrls: ['./verification-email.component.css']
})
export class VerificationEmailComponent implements OnInit {
    constructor() { }
  
    ngOnInit(): void {
      document.body.classList.add('hide-header-footer');
    }
  
    ngOnDestroy(): void {
      document.body.classList.remove('hide-header-footer');
    }
  
  }
