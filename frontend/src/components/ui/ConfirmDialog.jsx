import Modal from './Modal.jsx';

/** Generic "are you sure?" prompt. */
export default function ConfirmDialog({
  open,
  title = 'Confirm',
  message = 'Are you sure?',
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  danger = true,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onCancel}
      maxWidth="max-w-md"
      footer={
        <>
          <button type="button" className="btn-secondary" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={danger ? 'btn-danger' : 'btn-primary'}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <div className="flex items-start gap-md">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${danger ? 'bg-error-container text-on-error-container' : 'bg-surface-container text-on-surface-variant'}`}>
          <span className="material-symbols-outlined text-[20px]">
            {danger ? 'priority_high' : 'help'}
          </span>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant">{message}</p>
      </div>
    </Modal>
  );
}
