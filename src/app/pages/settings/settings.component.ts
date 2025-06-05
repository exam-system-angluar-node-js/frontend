import { Component } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { FileUploadService } from '../../services/file-upload.service';
import { ToastrService } from 'ngx-toastr';

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
  isUploading = false;
  profileData = {
    avatar: 'https://flowbite.com/docs/images/people/profile-picture-5.jpg'
  };

  avatarPreview: SafeUrl | null = null;
  showDeleteConfirmation = false;
  currentUser: any = null;
  userDetails: any = null;
  selectedFile: File | null = null;

  constructor(
    private sanitizer: DomSanitizer,
    private authService: AuthService,
    private fileUploadService: FileUploadService,
    private toastr: ToastrService
  ) {
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

      // Validate file type
      if (!file.type.match(/image\/(jpeg|png)/)) {
        this.toastr.error('Please select a valid image file (JPEG or PNG)');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.toastr.error('Image size should be less than 5MB');
        return;
      }

      this.selectedFile = file;
      const reader = new FileReader();

      reader.onload = (e) => {
        this.avatarPreview = this.sanitizer.bypassSecurityTrustUrl(e.target?.result as string);
      };

      reader.readAsDataURL(file);
    }
  }

  async saveChanges(): Promise<void> {
    try {
      let imageUrl = this.userDetails.avatar;
      if (this.selectedFile) {
        this.isUploading = true;
        const result = await this.fileUploadService.uploadImage(this.selectedFile).toPromise();
        if (result && result.imageUrl) {
          imageUrl = result.imageUrl;
        }
        this.isUploading = false;
      }

      // Update the user profile with the new imageUrl
      const res = await this.authService.updateProfile({ avatar: imageUrl }).toPromise();
      if (res && res.user) {
        this.userDetails = res.user;
      }
      this.avatarPreview = null;
      this.selectedFile = null;

      // Show toastr and reload after it disappears
      const toastRef = this.toastr.success('Profile changes saved!');
      toastRef.onHidden.subscribe(() => {
        window.location.reload();
      });

      // Clear the file input
      (document.getElementById('avatar-upload') as HTMLInputElement).value = '';

    } catch (error) {
      this.isUploading = false;
      this.toastr.error('Failed to update profile');
      console.error('Error updating profile:', error);
    }
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

  getAvatarUrl(): string {
    if (this.userDetails && this.userDetails.avatar) {
      if (this.userDetails.avatar.startsWith('http')) {
        return this.userDetails.avatar;
      }
      return 'http://localhost:3000' + this.userDetails.avatar;
    }
    return this.profileData.avatar;
  }
}



