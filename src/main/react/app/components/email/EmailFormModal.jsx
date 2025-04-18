import React, { useState } from "react";
import { Button, Modal } from "rsuite";
import AppConfig from "#config/AppConfig.json";
import axios from "axios";

const EmailFormModal = ({ open, onClose }) => {
  const fetchURL = AppConfig.fetch["mytest"];
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await axios.post(
        `${fetchURL.protocol}${fetchURL.url}/email/send`,
        { to, subject, body }
      );
      setMessage(response.data?.message || "메일이 성공적으로 발송되었습니다.");
      setTo("");
      setSubject("");
      setBody("");
    } catch (error) {
      setMessage("메일 발송 오류: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTo("");
    setSubject("");
    setBody("");
    setMessage("");
    onClose?.(); // Trigger the parent's onClose callback to close the modal
  };

  return (
    <Modal open={open} onClose={handleClose} size="xs">
      <Modal.Header>
        <Modal.Title>이메일 발송</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 10 }}>
            <label>To:</label>
            <input
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              required
              style={{ width: "100%" }}
            />
          </div>
          <div style={{ marginBottom: 10 }}>
            <label>Subject:</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              style={{ width: "100%" }}
            />
          </div>
          <div style={{ marginBottom: 10 }}>
            <label>Body:</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              style={{ width: "100%" }}
            />
          </div>
          <Button type="submit" appearance="primary" loading={loading} style={{ marginRight: 8 }}>
            메일 보내기
          </Button>
          <Button onClick={handleClose} appearance="subtle">
            취소
          </Button>
        </form>
        {message && <p style={{ marginTop: 10 }}>{message}</p>}
      </Modal.Body>
    </Modal>
  );
};

export default EmailFormModal;