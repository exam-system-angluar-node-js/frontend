
import { Component } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
    username: 'gendyvip',
    fullName: 'Mohamed Elgendy',
    email: 'gendyisvip@gmail.com',
    avatar: 'https://flowbite.com/docs/images/people/profile-picture-5.jpg'
  };

  avatarPreview: SafeUrl;
  showDeleteConfirmation = false;

  constructor(private sanitizer: DomSanitizer) {
    this.avatarPreview = this.sanitizer.bypassSecurityTrustUrl(this.profileData.avatar);
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
    console.log('Profile updated:', this.profileData);
    alert('Profile changes saved!');
  }

  // Delete Account Validation
  canDelete(): boolean {
    return this.deleteData.email === this.profileData.email && 
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



