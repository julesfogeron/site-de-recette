import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IRecette } from '../recette.model';
import { RecetteService } from '../service/recette.service';

@Component({
  templateUrl: './recette-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class RecetteDeleteDialogComponent {
  recette?: IRecette;

  protected recetteService = inject(RecetteService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.recetteService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
