import { AlertTriangle } from "lucide-react";
import Modal from "./Modal.jsx";

const ConfirmDialog = ({ open, onClose, onConfirm, title, message }) => (
  <Modal open={open} onClose={onClose} title={title} size="sm">
    <div className="flex gap-3">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-500/15">
        <AlertTriangle className="h-5 w-5 text-red-400" />
      </div>
      <p className="text-sm text-slate-300">{message}</p>
    </div>
    <div className="mt-6 flex justify-end gap-3">
      <button className="btn-secondary" onClick={onClose}>
        Cancel
      </button>
      <button
        className="btn-danger"
        onClick={() => {
          onConfirm();
          onClose();
        }}
      >
        Delete
      </button>
    </div>
  </Modal>
);

export default ConfirmDialog;
