import {Component, EventEmitter, HostListener, OnInit, Output} from '@angular/core';
import {AvailableKey, EventUtil} from '@tk-ui/utils/event.util';
import {ModalService} from '@tk-ui/components/modal/services/modal.service';

@Component({
  selector: 'app-modal-backdrop',
  templateUrl: './modal-backdrop.component.html',
  styleUrls: ['./modal-backdrop.component.scss']
})
export class ModalBackdropComponent implements OnInit {
  /**
   * emit when the backdrop is clicked
   */
  @Output() backdropClick: EventEmitter<void> = new EventEmitter();

  constructor(
    private modalService: ModalService,
  ) { }

  ngOnInit(): void {
  }

  @HostListener('click')
  onHostClicked(): void {
    this.backdropClick.emit();
  }

  /**
   * bind listener for keydown to detect ESC button to close modal
   * @param event keyboard event
   */
  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent): void {
    if (EventUtil.isKey(event, AvailableKey.Escape)) {
      this.modalService.closeLatestModal();
    }
  }
}
