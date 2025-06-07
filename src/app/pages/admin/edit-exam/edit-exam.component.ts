import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QuestionService, Question } from '../../../services/question.service';
import { ExamService } from '../../../services/exam.service';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { Observable } from 'rxjs';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-edit-exam',
  templateUrl: './edit-exam.component.html',
  styleUrls: ['./edit-exam.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmModalComponent],
})
export class EditExamComponent implements OnInit {
  examId: string = '';
  showAddQuestionForm: boolean = false;
  editingQuestion: Question | null = null;
  isLoading = false;
  errorMessage: string | null = null;

  // Form data
  examTitle: string = '';
  examDescription: string = '';
  timeLimit: number = 0;

  // Question form data
  questionText: string = '';
  choices: string[] = ['', '', '', ''];
  correctAnswer: number = 0;
  points: number = 1;

  // Questions list
  questions: Question[] = [];
  originalQuestions: Question[] = []; // To track changes
  deletedQuestionIds: number[] = []; // To track deleted questions

  // Add new properties for delete modal
  showDeleteModal = false;
  isDeleting = false;
  questionToDelete: number | undefined;

  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionService,
    private examService: ExamService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.examId = this.route.snapshot.params['id'];
    this.loadExamData();
  }

  loadExamData(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.examService.getExamById(parseInt(this.examId)).subscribe({
      next: (exam) => {
        this.examTitle = exam.title;
        this.examDescription = exam.description;
        this.timeLimit = exam.duration;

        this.questionService.getQuestions(parseInt(this.examId)).subscribe({
          next: (questions) => {
            console.log('questions', questions);
            this.questions = questions;
            this.originalQuestions = JSON.parse(JSON.stringify(questions)); // Deep copy
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Failed to load questions', err);
            this.isLoading = false;
            this.errorMessage = 'Failed to load questions';
            this.toastr.error('Failed to load questions', 'Error');
          },
        });
      },
      error: (err) => {
        console.error('Failed to load exam', err);
        this.isLoading = false;
        this.errorMessage = 'Failed to load exam details';
        this.toastr.error('Failed to load exam details', 'Error');
      },
    });
  }

  toggleAddQuestionForm(): void {
    this.showAddQuestionForm = !this.showAddQuestionForm;
    if (!this.showAddQuestionForm) {
      this.resetQuestionForm();
    }
  }

  editQuestion(question: Question): void {
    this.editingQuestion = question;
    this.questionText = question.title;
    this.choices = [...question.options];
    this.correctAnswer = question.answer;
    this.points = question.points; // Make sure points are also loaded for editing
    this.showAddQuestionForm = true;
  }

  onQuestionSubmit(): void {
    if (!this.questionText || this.choices.some((choice) => !choice) || this.correctAnswer < 0 || this.correctAnswer >= this.choices.length) {
      this.toastr.error('Please fill in all fields and select a valid correct answer', 'Error');
      return;
    }

    const questionData: Question = {
      title: this.questionText,
      options: [...this.choices],
      points: this.points,
      answer: this.correctAnswer,
      examId: parseInt(this.examId),
    };

    if (this.editingQuestion) {
      // Update existing question in the local array
      const index = this.questions.findIndex(
        (q) => q.id === this.editingQuestion!.id
      );
      if (index !== -1) {
        this.questions[index] = {
          ...this.questions[index],
          ...questionData,
          id: this.editingQuestion.id, // Preserve the ID
        };
        this.toastr.success('Question has been updated', 'Successfully Updated');
      }
      this.editingQuestion = null;
    } else {
      // Add new question to the local array with a temporary ID
      const newQuestion: Question = {
        ...questionData,
        id: Date.now(), // Use timestamp as temporary ID
      };
      this.questions.push(newQuestion);
      this.toastr.success('Question has been added', 'Successfully Added');
    }

    // Reset form and hide it
    this.resetQuestionForm();
    this.showAddQuestionForm = false;
  }

  resetQuestionForm(): void {
    this.questionText = '';
    this.choices = ['', '', '', ''];
    this.correctAnswer = 0;
    this.points = 1;
    this.editingQuestion = null;
    this.errorMessage = '';
  }

  deleteQuestion(questionId: number | undefined): void {
    if (questionId === undefined) return;
    this.questionToDelete = questionId;
    this.showDeleteModal = true;
  }

  onDeleteConfirm(): void {
    if (this.questionToDelete === undefined) return;
    
    this.isDeleting = true;
    
    // If the question has a real ID, add it to the deletedQuestionIds array
    if (this.questionToDelete < 1000000) { // Assuming temporary IDs are large timestamps
      this.deletedQuestionIds.push(this.questionToDelete);
    }
    
    // Remove the question from the local array
    this.questions = this.questions.filter((q) => q.id !== this.questionToDelete);
    this.toastr.success('Question marked for deletion', 'Successfully Deleted');
    
    this.isDeleting = false;
    this.showDeleteModal = false;
    this.questionToDelete = undefined;
  }

  onDeleteCancel(): void {
    this.showDeleteModal = false;
    this.questionToDelete = undefined;
  }

  saveExam(): void {
    this.isLoading = true;
    this.errorMessage = null;

    const examUpdatePayload = {
      title: this.examTitle,
      description: this.examDescription,
      duration: this.timeLimit, // Corrected key to 'duration'
    };

    // 1. Update Exam Details
    this.examService.updateExam(parseInt(this.examId), examUpdatePayload).subscribe({
      next: (updatedExam) => {
        console.log('Exam details updated.');

        // 2. Handle Questions (Add, Update, Delete)
        const questionsToProcess: Observable<any>[] = [];

        // Questions to Delete
        this.deletedQuestionIds.forEach(questionId => {
          console.log('Deleting question with ID:', questionId);
          questionsToProcess.push(this.questionService.deleteQuestion(questionId));
        });

        // Questions to Add and Update
        this.questions.forEach(question => {
          if (question.id && question.id < 1000000) {
            // Existing question - check if modified
            const originalQuestion = this.originalQuestions.find(q => q.id === question.id);
            if (originalQuestion && JSON.stringify(question) !== JSON.stringify(originalQuestion)) {
              console.log('Updating question with ID:', question.id);
              questionsToProcess.push(this.questionService.updateQuestion(question));
            }
          } else {
            // New question with temporary ID - add it
            const { id, ...questionToAdd } = question; // Remove temporary ID
            console.log('Adding new question:', questionToAdd);
            // Add new questions in a batch after updates/deletions
          }
        });

        // Collect new questions to add in a batch
        const newQuestionsToAdd = this.questions
          .filter(q => q.id && q.id >= 1000000) // Filter for temporary IDs
          .map(({ id, ...question }) => question); // Remove temporary IDs

        if (newQuestionsToAdd.length > 0) {
          console.log('Adding new questions in batch:', newQuestionsToAdd);
          questionsToProcess.push(this.questionService.addQuestions(parseInt(this.examId), newQuestionsToAdd));
        }

        // Execute all question-related operations
        if (questionsToProcess.length > 0) {
          forkJoin(questionsToProcess).subscribe({
            next: () => {
              console.log('All question operations completed.');
              this.toastr.success('Exam and questions saved successfully', 'Success');
              this.isLoading = false;
              this.router.navigate(['/teacher/manage']);
            },
            error: (err) => {
              console.error('Failed to save questions', err);
              this.errorMessage = 'Failed to save questions';
              this.toastr.error('Failed to save questions', 'Error');
              this.isLoading = false;
            }
          });
        } else {
          // No question changes, just exam details updated
          this.toastr.success('Exam details saved successfully', 'Success');
          this.isLoading = false;
          this.router.navigate(['/teacher/manage']);
        }

      },
      error: (err) => {
        console.error('Failed to update exam details', err);
        this.errorMessage = 'Failed to update exam details';
        this.toastr.error('Failed to update exam details', 'Error');
        this.isLoading = false;
      },
    });
  }
}
