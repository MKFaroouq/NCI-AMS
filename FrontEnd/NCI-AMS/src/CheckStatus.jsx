import React, { useState } from 'react';

const CheckStatus = () => {
    const [nationalId, setNationalId] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCheck = async (e) => {
        e.preventDefault();
        setError('');
        setResult(null);
        setLoading(true);

        if (nationalId.trim().length !== 14) {
            setError('الرقم القومي يجب أن يتكون من 14 رقم بالظبط.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/bookings/status/${nationalId.trim()}`);
            const data = await response.json();

            if (response.ok) {
                setResult(data); 
            } else {
                setError(data.error || 'عفواً، لا يوجد حجز مسجل بهذا الرقم.');
            }
        } catch (err) {
            setError('تعذر الاتصال بسيرفر المستشفى الداخلي.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    // ----------------------------------------------------
    // الـ API الجديد والمضمون 100% لتوليد الـ QR Code للعربي
    // ----------------------------------------------------
    const getQrCodeUrl = () => {
        if (!result) return '';
        // نص البيانات اللي هتظهر لما تعمل سكان
        const qrText = `المستشفى العام - تذكرة رقم: #${result.queueNumber}\nالاسم: ${result.patientName}\nالعيادة: ${result.department}\nالرقم القومي: ${result.nationalId}`;
        // استخدام سرفر qrserver المستقر جداً مع الحروف العربية
        return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrText)}`;
    };

    return (
        <div style={{ padding: '10px', maxWidth: '100%', margin: '0 auto', fontFamily: 'Cairo, sans-serif' }}>
            
            {/* منطقة الشاشة العادية */}
            <div className="non-printable-area">
                <h3 style={{ textAlign: 'center', color: '#0c2340', marginBottom: '15px' }}> الاستعلام عن دورك وتذكرتك</h3>
                
                <form onSubmit={handleCheck}>
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#475569' }}>أدخل الرقم القومي للمريض:</label>
                        <input 
                            type="text" 
                            maxLength="14"
                            value={nationalId}
                            onChange={(e) => { setError(''); setResult(null); setNationalId(e.target.value); }}
                            placeholder="اكتب 14 رقم بالكامل..."
                            className="form-control"
                            style={{ textAlign: 'center', fontSize: '16px', letterSpacing: '1px' }}
                            required
                        />
                    </div>
                    <button type="submit" className="submit-btn" style={{ background: '#0c2340', marginTop: '12px' }} disabled={loading}>
                        {loading ? 'جاري جلب البيانات...' : 'استعلام عن الحالة '}
                    </button>
                </form>

                {/* رسالة الخطأ */}
                {error && (
                    <div style={{ color: '#dc2626', backgroundColor: '#fef2f2', padding: '10px', borderRadius: '6px', textAlign: 'center', marginTop: '15px', fontWeight: 'bold', border: '1px solid #fee2e2' }}>
                         {error}
                    </div>
                )}

                {/* بطاقة عرض النتيجة */}
                {result && (
                    <div style={{ marginTop: '25px', background: '#fff', border: '2px dashed #0c2340', padding: '25px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>
                        <h4 style={{ margin: '0 0 10px 0', color: '#0c2340', fontSize: '18px' }}> المريض: {result.patientName}</h4>
                        <p style={{ color: '#475569', margin: '5px 0' }}>العيادة: <strong style={{ color: '#0c2340' }}>{result.department}</strong></p>
                        
                        <div style={{ margin: '18px 0' }}>
                            <span style={{ 
                                padding: '6px 16px', 
                                borderRadius: '20px', 
                                fontSize: '14px', 
                                fontWeight: 'bold',
                                background: result.status === 'pending' ? '#fef3c7' : result.status === 'approved' ? '#dcfce7' : '#fee2e2',
                                color: result.status === 'pending' ? '#d97706' : result.status === 'approved' ? '#15803d' : '#b91c1c'
                            }}>
                                حالة الطلب: {result.status === 'pending' ? ' تحت المراجعة' : result.status === 'approved' ? ' تم القبول والموافقة' : ' تم الرفض'}
                            </span>
                        </div>

                        {/* في حالة القبول */}
                        {result.status === 'approved' && (
                            <>
                                <div style={{ background: '#0f172a', color: '#fff', padding: '15px', borderRadius: '8px', marginTop: '15px' }}>
                                    <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#94a3b8' }}>رقم دورك الحالي في قائمة الانتظار</p>
                                    <p style={{ fontSize: '36px', fontWeight: 'bold', margin: 0, color: '#22c55e' }}>#{result.queueNumber}</p>
                                    <small style={{ color: '#64748b' }}>يرجى الاحتفاظ برقم التذكرة عند الحضور للمعهد.</small>
                                </div>

                                {/* عرض الـ QR Code المحدث على الشاشة للمريض */}
                                <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                    <img 
                                        src={getQrCodeUrl()} 
                                        alt="QR Code" 
                                        style={{ border: '2px solid #0c2340', padding: '8px', borderRadius: '8px', backgroundColor: '#fff', width: '130px', height: '130px' }} 
                                    />
                                    <p style={{ fontSize: '12px', color: '#475569', margin: '8px 0 0 0', fontWeight: 'bold' }}>رقم التذكرة الذكي متاح للمسح الضوئي</p>
                                </div>

                                <button 
                                    onClick={handlePrint}
                                    style={{
                                        backgroundColor: '#16a34a',
                                        color: '#ffffff',
                                        border: 'none',
                                        padding: '12px 20px',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                        fontSize: '15px',
                                        marginTop: '20px',
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        boxShadow: '0 4px 6px rgba(22, 163, 74, 0.2)',
                                        transition: '0.2s'
                                    }}
                                >
                                     طباعة تذكرة الدخول (Print Ticket)
                                </button>
                            </>
                        )}
                        
                        {result.status === 'pending' && (
                            <p style={{ fontSize: '13px', color: '#64748b', marginTop: '10px', backgroundColor: '#f8fafc', padding: '8px', borderRadius: '4px' }}>
                                 طلبك قيد الانتظار حالياً، بمجرد اعتماد الموظف لطلبك سيظهر رقم دورك هنا فوراً.
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* ------------------ التذكرة الحرارية المخفية (تظهر فقط في الطباعة) ------------------ */}
            {result && result.status === 'approved' && (
                <div className="printable-ticket-slip">
                    <div className="ticket-inner-card">
                        <div className="ticket-header-title">المستشفى العام</div>
                        <div className="ticket-subtitle">نظام إدارة وتوجيه العيادات الخارجية</div>
                        
                        <div className="ticket-dashed-line"></div>
                        
                        <div className="ticket-queue-box">
                            <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>رقم دور الـدخـول</div>
                            <div style={{ fontSize: '34px', fontWeight: 'bold' }}>#{result.queueNumber}</div>
                        </div>
                        
                        <div className="ticket-dashed-line"></div>
                        
                        <div className="ticket-details-rows">
                            <div><strong>اسم المريض:</strong> {result.patientName}</div>
                            <div><strong>العيادة المختصة:</strong> {result.department}</div>
                            <div><strong>تاريخ الحجز:</strong> {result.bookingDate || new Date().toLocaleDateString('ar-EG')}</div>
                            <div><strong>الرقم القومي:</strong> {result.nationalId}</div>
                        </div>
                        
                        <div className="ticket-dashed-line"></div>

                        {/* طباعة الـ QR Code الجديد داخل التذكرة الورقية */}
                        <div style={{ margin: '15px 0', display: 'flex', justifyContent: 'center' }}>
                            <img src={getQrCodeUrl()} alt="Ticket QR" style={{ width: '130px', height: '130px' }} />
                        </div>
                        
                        <div className="ticket-dashed-line"></div>
                        
                        <div className="ticket-footer-text">
                            <p>يرجى تقديم التذكرة والـ QR للموجه عند الدخول.</p>
                            <p>تمنياتنا لكم بالشفاء العاجل </p>
                            <span style={{ fontSize: '9px', color: '#555', display: 'block', marginTop: '8px' }}>
                                طُبع في: {new Date().toLocaleString('ar-EG')}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* ستايل الطباعة الذكي */}
            <style>{`
                .printable-ticket-slip {
                    display: none;
                }

                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .non-printable-area, .non-printable-area * {
                        display: none !important;
                    }
                    .printable-ticket-slip, .printable-ticket-slip * {
                        visibility: visible;
                        display: block !important;
                    }
                    .printable-ticket-slip {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        direction: rtl;
                        font-family: 'Cairo', 'Arial', sans-serif;
                    }
                    .ticket-inner-card {
                        width: 76mm;
                        margin: 0 auto;
                        padding: 10px;
                        border: 1px dashed #000000;
                        text-align: center;
                    }
                    .ticket-header-title {
                        font-size: 18px;
                        font-weight: bold;
                        margin-bottom: 2px;
                    }
                    .ticket-subtitle {
                        font-size: 11px;
                        color: #333;
                        margin-bottom: 10px;
                    }
                    .ticket-dashed-line {
                        border-top: 1px dashed #000;
                        margin: 8px 0;
                    }
                    .ticket-queue-box {
                        border: 1px solid #000;
                        padding: 8px;
                        margin: 10px 0;
                        background: #fdfdfd;
                    }
                    .ticket-details-rows {
                        text-align: right;
                        font-size: 12px;
                        line-height: 1.7;
                        padding-right: 5px;
                    }
                    .ticket-footer-text {
                        font-size: 10px;
                        margin-top: 12px;
                        line-height: 1.4;
                    }
                }
            `}</style>

        </div>
    );
};

export default CheckStatus;
