// src/EmailChecker.js
import React, { useState } from 'react';
import './EmailChecker.css';

function EmailChecker() {
  const [fromEmail, setFromEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [hasAttachment, setHasAttachment] = useState(false);
  const [containsSuspiciousLinks, setContainsSuspiciousLinks] = useState(false);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setResult(null);

    const emailData = {
      fromEmail,
      subject,
      content,
      hasAttachment,
      containsSuspiciousLinks,
    };

    try {
      const response = await fetch('http://localhost/gmail-project/back-end/check_email.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(emailData),
      });

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Kết quả từ backend:', data);

      setResult({
        classification: data.classification,
        message: data.message,
        resultClass: data.resultClass,
        details: data.details // Lấy thêm trường details
      });

    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu đến backend:', error);
      setResult({
        classification: 'Lỗi',
        message: 'Không thể kết nối đến máy chủ hoặc có lỗi xảy ra. Vui lòng thử lại.',
        resultClass: 'dangerous',
        details: null // Đảm bảo details là null khi có lỗi
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="email-checker-container">
      <h1>Kiểm Tra An Toàn Gmail Nâng Cao</h1>
      <form onSubmit={handleSubmit} className="email-form">
        <div className="form-group">
          <label htmlFor="fromEmail">Địa chỉ Email người gửi (From):</label>
          <input
            type="email"
            id="fromEmail"
            value={fromEmail}
            onChange={(e) => setFromEmail(e.target.value)}
            placeholder="ví dụ: support@example.com"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="subject">Tiêu đề Email (Subject):</label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="ví dụ: Thông báo quan trọng về tài khoản của bạn"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Nội dung Email (một phần hoặc toàn bộ):</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Dán một phần nội dung email vào đây để phân tích"
            rows="5"
            required
          ></textarea>
        </div>

        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            id="hasAttachment"
            checked={hasAttachment}
            onChange={(e) => setHasAttachment(e.target.checked)}
          />
          <label htmlFor="hasAttachment">Email có tệp đính kèm không?</label>
        </div>

        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            id="containsSuspiciousLinks"
            checked={containsSuspiciousLinks}
            onChange={(e) => setContainsSuspiciousLinks(e.target.checked)}
          />
          <label htmlFor="containsSuspiciousLinks">Email có chứa liên kết đáng ngờ không?</label>
        </div>

        <button type="submit" className="check-button" disabled={loading}>
          {loading ? 'Đang kiểm tra...' : 'Kiểm Tra An Toàn'}
        </button>
      </form>

      {loading && <p className="loading-message">Đang phân tích email của bạn...</p>}

      {result && !loading && (
        <div className={`result-box ${result.resultClass}`}>
          <h2>Kết Quả Phân Loại:</h2>
          <p><strong>Phân loại:</strong> <span className="classification-text">{result.classification}</span></p>
          <p><strong>Lời khuyên:</strong> {result.message}</p>

          {/* Hiển thị chi tiết hơn từ backend */}
          {result.details && (
            <div className="classification-details">
              <p><strong>Độ tin cậy:</strong> {(result.details.confidence * 100).toFixed(0)}%</p>
              <p><strong>Mức độ:</strong> {result.details.level}</p>
              {result.details.indicators && result.details.indicators.length > 0 && (
                <div>
                  <p><strong>Dấu hiệu nhận biết:</strong></p>
                  <ul>
                    {result.details.indicators.map((indicator, index) => (
                      <li key={index}>{indicator}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default EmailChecker;