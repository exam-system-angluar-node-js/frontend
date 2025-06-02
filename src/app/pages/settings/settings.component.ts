
import { Component } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-settings',
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  deleteData = {
    email: '',
    confirmation: ''
  };

  isDeleting = false;
  profileData = {
    avatar: 'https://flowbite.com/docs/images/people/profile-picture-5.jpg'
  };

  avatarPreview: SafeUrl;
  showDeleteConfirmation = false;
  currentUser:any = null;
  userDetails:any = null;
  constructor(private sanitizer: DomSanitizer,private authService:AuthService) {
    this.avatarPreview = this.sanitizer.bypassSecurityTrustUrl(this.profileData.avatar);
    this.initializeUserInfo();

  }

    private initializeUserInfo(): void {
    this.currentUser = this.authService.currentUserValue;
    if (this.currentUser) {
      this.userDetails = this.currentUser;
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        this.avatarPreview = this.sanitizer.bypassSecurityTrustUrl(e.target?.result as string);
      };
      
      reader.readAsDataURL(file);
    }
  }
  
  saveChanges(): void {
    // Implement save logic
    console.log('Profile updated:', this.userDetails);
    alert('Profile changes saved!');
  }

  // Delete Account Validation
  canDelete(): boolean {
    return this.deleteData.email === this.userDetails.email && 
           this.deleteData.confirmation.toUpperCase() === 'DELETE';
  }

  // Delete Account Handler
  deleteAccount(): void {
    if (!this.canDelete()) return;
    
    this.isDeleting = true;
    console.log('Initiating account deletion...');
    
    // Simulate API call
    setTimeout(() => {
      console.log('Account deleted successfully');
      alert('Your account has been permanently deleted');
      this.isDeleting = false;
      this.resetDeleteForm();
      // Here you would typically redirect to login/home page
    }, 1500);
  }

  // Reset Delete Form
  resetDeleteForm(): void {
    this.deleteData = { email: '', confirmation: '' };
  }
}



