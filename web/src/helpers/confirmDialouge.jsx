import Swal from 'sweetalert2';

export function confirmDialouge({ title, text }) {
	return new Promise((resolve) => {
		Swal.fire({
			title,
			text,
			showCancelButton: true,
			confirmButtonText: 'Yes',
			denyButtonText: `No`,
		}).then((result) => {
			if (result.isConfirmed) {
				resolve(true);
			} else if (result.isDenied) {
				resolve(false);
			} else {
				resolve(false);
			}
		});
	});
}
