import React, { useState } from "react";
import { Modal } from "rsuite";
import Appconfig from "#config/AppConfig.json";
import axios from "axios";
import styles from "#styles/emailstyle.module.css"; // email style import

const EmailFormModal = ({ open, onClose }) => {
	const rawFetchURL = Appconfig.fetch["mytest"];
	const fetchURL = rawFetchURL.protocol + rawFetchURL.url;

	const [to, setTo] = useState("");
	const [subject, setSubject] = useState("");
	const [text, setText] = useState("");
	const [file, setFile] = useState(null);
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setMessage("");

		const formData = new FormData();
		formData.append("to", to);
		formData.append("subject", subject);
		formData.append("text", text);
		if (file) formData.append("files", file);

		try {
			await axios.post(`${fetchURL}/email/send`, formData, {
				headers: {
					"Content-Type": "multipart/form-data"
				}
			});
			alert("이메일이 전송되었습니다!");
			handleClose();
		} catch (error) {
			setMessage("메일 발송 오류: " + (error.response?.data?.message || error.message));
		} finally {
			setLoading(false);
		}
	};

	const handleClose = () => {
		setTo("");
		setSubject("");
		setText("");
		setFile(null);
		setMessage("");
		onClose?.();
	};

	return (
		<Modal open={open} onClose={handleClose} size="md">
			<Modal.Header>
				<Modal.Title className={styles.modalTitle}>이메일 발송</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<form onSubmit={handleSubmit}>
					<div className={styles.formGroup}>
						<label className={styles.label}>수신:</label>
						<input
							type="email"
							value={to}
							onChange={(e) => setTo(e.target.value)}
							required
							className={`${styles.input}`}
						/>
					</div>
					<div className={styles.formGroup}>
						<label className={styles.label}>제목:</label>
						<input
							type="text"
							value={subject}
							onChange={(e) => setSubject(e.target.value)}
							required
							className={styles.input}
						/>
					</div>
					<div className={styles.formGroup}>
						<label className={styles.label}>본문:</label>
						<textarea
							value={text}
							onChange={(e) => setText(e.target.value)}
							required
							className={styles.textarea}
						/>
					</div>
					<div className={styles.formGroup}>
						<label className={styles.label}>첨부파일:</label>
						<input
							type="file"
							onChange={(e) => {
								const file = e.target.files?.[0];
								const maxSizeInMB = 10; // 업로드 최대 크기 (10MB)
								if (file) {
									if (file.size > maxSizeInMB * 1024 * 1024) {
										alert(`파일 크기가 ${maxSizeInMB}MB를 초과했습니다. 다른 파일을 선택해주세요.`);
										e.target.value = ''; // 파일 input 초기화
										setFile(null);
										return;
									}
									setFile(file);
								} else {
									setFile(null);
								}
							}}
							className={styles.fileInput}
						 />
					</div>
					<div className={styles.buttonContainer}>
						<button
							type="submit"
							className={styles.primaryButton}
							disabled={loading}
						>
							메일 보내기
						</button>
						<button
							type="button"
							onClick={handleClose}
							className={styles.secondaryButton}
						>
							취소
						</button>
					</div>
				</form>
				{message && <p className={styles.errorMessage}>{message}</p>}
			</Modal.Body>
		</Modal>
	);
};

export default EmailFormModal;