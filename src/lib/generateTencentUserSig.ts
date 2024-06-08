export default async function generateTencentUserSig(
  sdkAppId: number,
  secretKey: string,
  userId: string,
  expire: number
) {
  const currTimeInSeconds = Math.floor(Date.now() / 1000);

  const msg = `${userId}${sdkAppId}${currTimeInSeconds}${expire}`;

  const base64Msg = Buffer.from(msg).toString("base64");

  const msgWithBase64 = `${msg}${base64Msg}`;

  const hmac = crypto.createHmac("sha256", secretKey);
  hmac.update(msgWithBase64);
  const userSig = hmac.digest("hex");

  return userSig;
}
