const SibApiV3Sdk = require('sib-api-v3-sdk');

// 🔥 Brevo API setup
const sendEmail = async (to, subject, html) => {
  const client = SibApiV3Sdk.ApiClient.instance;
  const apiKey = client.authentications['api-key'];
  apiKey.apiKey = process.env.BREVO_API_KEY;

  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  await apiInstance.sendTransacEmail({
    sender: {
      email: process.env.BREVO_USER,
      name: "MyShop",
    },
    to: [{ email: to }],
    subject,
    htmlContent: html,
  });
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

const buildAdminOrderEmail = (order, storeName) => {
  const itemsHTML = order.items.map(item => `
    <tr>
      <td style="padding:12px;border-bottom:1px solid #f0f0f0;">
        <strong>${item.name}</strong>
      </td>
      <td style="padding:12px;border-bottom:1px solid #f0f0f0;text-align:center;">${item.quantity}</td>
      <td style="padding:12px;border-bottom:1px solid #f0f0f0;text-align:right;">${item.price.toFixed(2)} €</td>
      <td style="padding:12px;border-bottom:1px solid #f0f0f0;text-align:right;"><strong>${(item.price * item.quantity).toFixed(2)} €</strong></td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Nouvelle commande reçue 🛒</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:640px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);padding:40px 32px;text-align:center;">
      <div style="font-size:48px;margin-bottom:12px;">🛒</div>
      <h1 style="margin:0;color:#fff;font-size:26px;font-weight:700;letter-spacing:-0.5px;">Nouvelle commande reçue</h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,0.7);font-size:14px;">${storeName}</p>
    </div>

    <!-- Order Meta -->
    <div style="padding:24px 32px;background:#f8f9ff;border-bottom:1px solid #eee;">
      <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;">
        <div>
          <div style="font-size:11px;text-transform:uppercase;color:#888;letter-spacing:1px;margin-bottom:4px;">Numéro de commande</div>
          <div style="font-size:20px;font-weight:700;color:#1a1a2e;">${order.orderNumber}</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:11px;text-transform:uppercase;color:#888;letter-spacing:1px;margin-bottom:4px;">Date</div>
          <div style="font-size:14px;color:#444;">${formatDate(order.createdAt)}</div>
        </div>
      </div>
    </div>

    <div style="padding:32px;">
      <!-- Customer Info -->
      <h2 style="margin:0 0 16px;font-size:16px;text-transform:uppercase;color:#888;letter-spacing:1px;">Client</h2>
      <div style="background:#f8f9ff;border-radius:12px;padding:20px;margin-bottom:28px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:6px 0;color:#888;font-size:13px;width:100px;">Nom</td>
            <td style="padding:6px 0;font-weight:600;color:#222;">${order.customer.name}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#888;font-size:13px;">Téléphone</td>
            <td style="padding:6px 0;font-weight:600;color:#222;">${order.customer.phone}</td>
          </tr>
          ${order.customer.email ? `<tr><td style="padding:6px 0;color:#888;font-size:13px;">Email</td><td style="padding:6px 0;color:#222;">${order.customer.email}</td></tr>` : ''}
          <tr>
            <td style="padding:6px 0;color:#888;font-size:13px;">Adresse</td>
            <td style="padding:6px 0;color:#222;">${order.customer.address}</td>
          </tr>
        </table>
      </div>

      <!-- Products -->
      <h2 style="margin:0 0 16px;font-size:16px;text-transform:uppercase;color:#888;letter-spacing:1px;">Produits commandés</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
        <thead>
          <tr style="background:#f0f0f0;">
            <th style="padding:12px;text-align:left;font-size:12px;text-transform:uppercase;color:#666;">Produit</th>
            <th style="padding:12px;text-align:center;font-size:12px;text-transform:uppercase;color:#666;">Qté</th>
            <th style="padding:12px;text-align:right;font-size:12px;text-transform:uppercase;color:#666;">Prix unit.</th>
            <th style="padding:12px;text-align:right;font-size:12px;text-transform:uppercase;color:#666;">Total</th>
          </tr>
        </thead>
        <tbody>${itemsHTML}</tbody>
      </table>

      <!-- Total -->
      <div style="background:linear-gradient(135deg,#1a1a2e,#16213e);border-radius:12px;padding:20px 24px;display:flex;justify-content:space-between;align-items:center;margin-bottom:28px;">
        <span style="color:rgba(255,255,255,0.8);font-size:14px;text-transform:uppercase;letter-spacing:1px;">Total de la commande</span>
        <span style="color:#fff;font-size:28px;font-weight:700;">${order.totalAmount.toFixed(2)} €</span>
      </div>

      ${order.notes ? `<div style="background:#fff8e1;border-left:4px solid #ffc107;padding:16px;border-radius:0 8px 8px 0;margin-bottom:28px;"><strong style="color:#856404;">Note:</strong> <span style="color:#444;">${order.notes}</span></div>` : ''}
    </div>

    <!-- Footer -->
    <div style="background:#f8f9ff;padding:20px 32px;text-align:center;border-top:1px solid #eee;">
      <p style="margin:0;color:#aaa;font-size:12px;">${storeName} · Commande gérée via le dashboard admin</p>
    </div>
  </div>
</body>
</html>
  `;
};

const buildCustomerConfirmEmail = (order, storeName) => {
  const itemsHTML = order.items.map(item => `
    <tr>
      <td style="padding:10px;border-bottom:1px solid #f0f0f0;">${item.name}</td>
      <td style="padding:10px;border-bottom:1px solid #f0f0f0;text-align:center;">${item.quantity}</td>
      <td style="padding:10px;border-bottom:1px solid #f0f0f0;text-align:right;">${(item.price * item.quantity).toFixed(2)} €</td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"/><title>Confirmation de commande</title></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);padding:40px 32px;text-align:center;">
      <div style="font-size:48px;margin-bottom:12px;">✅</div>
      <h1 style="margin:0;color:#fff;font-size:24px;font-weight:700;">Commande confirmée !</h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);">Merci pour votre commande, ${order.customer.name} !</p>
    </div>

    <div style="padding:32px;">
      <p style="color:#444;font-size:15px;line-height:1.6;">Votre commande <strong>${order.orderNumber}</strong> a bien été reçue. Nous vous contacterons bientôt pour confirmer la livraison.</p>

      <h2 style="font-size:16px;text-transform:uppercase;color:#888;letter-spacing:1px;margin-top:28px;">Récapitulatif</h2>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;">
        <thead>
          <tr style="background:#f0f0f0;">
            <th style="padding:10px;text-align:left;font-size:12px;color:#666;">Produit</th>
            <th style="padding:10px;text-align:center;font-size:12px;color:#666;">Qté</th>
            <th style="padding:10px;text-align:right;font-size:12px;color:#666;">Total</th>
          </tr>
        </thead>
        <tbody>${itemsHTML}</tbody>
      </table>

      <div style="background:linear-gradient(135deg,#1a1a2e,#16213e);border-radius:12px;padding:16px 20px;text-align:right;">
        <span style="color:rgba(255,255,255,0.7);">Total: </span>
        <strong style="color:#fff;font-size:22px;">${order.totalAmount.toFixed(2)} €</strong>
      </div>

      <p style="margin-top:28px;color:#666;font-size:13px;">Des questions ? Contactez-nous.</p>
    </div>

    <div style="background:#f8f9ff;padding:16px 32px;text-align:center;border-top:1px solid #eee;">
      <p style="margin:0;color:#aaa;font-size:12px;">${storeName} · Merci de votre confiance 🙏</p>
    </div>
  </div>
</body>
</html>
  `;
};

const sendOrderNotificationToAdmin = async (order, settings) => {
  if (!settings.notificationEmail) return;
  if (!process.env.BREVO_USER || !process.env.BREVO_API_KEY) return;

  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"${settings.storeName}" <${process.env.BREVO_USER}>`,
      to: settings.notificationEmail,
      subject: `🛒 Nouvelle commande ${order.orderNumber} - ${settings.storeName}`,
      html: buildAdminOrderEmail(order, settings.storeName),
    });
    console.log(`✉️ Admin notification sent to ${settings.notificationEmail}`);
  } catch (err) {
    console.error('❌ Failed to send admin email:', err.message);
  }
};

const sendOrderConfirmationToCustomer = async (order, settings) => {
  if (!order.customer.email) return;
  if (!process.env.BREVO_USER || !process.env.BREVO_API_KEY) return;

  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"${settings.storeName}" <${process.env.BREVO_USER}>`,
      to: order.customer.email,
      subject: `✅ Confirmation de commande ${order.orderNumber}`,
      html: buildCustomerConfirmEmail(order, settings.storeName),
    });
    console.log(`✉️ Confirmation sent to ${order.customer.email}`);
  } catch (err) {
    console.error('❌ Failed to send customer email:', err.message);
  }
};

module.exports = {
  sendOrderNotificationToAdmin,
  sendOrderConfirmationToCustomer,
};
