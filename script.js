function runCommand() {
  const cmd = document.getElementById("command").value;
  const log = document.getElementById("log");

  // 警告
  if (!confirm("お願いだから本当に、本当に悪用しないでね？")) {
    log.textContent += "\n操作がキャンセルされました。";
    return;
  }

  switch (cmd) {
    case "01":
      log.textContent += "\nApp Usage Limits removal selected. Generating profile...";
      generateProfile("Remove App Usage Limits", "app-limits");
      break;
    case "02":
      log.textContent += "\nDowntime removal selected. Generating profile...";
      generateProfile("Disable Downtime", "downtime");
      break;
    case "03":
      log.textContent += "\nSafari/App Store unlock selected. Generating profile...";
      generateProfile("Enable Safari and App Store", "safari-appstore");
      break;
    case "04":
      log.textContent += "\nAllow All Apps selected. Generating profile...";
      generateProfile("Allow All Apps", "allow-all");
      break;
    case "05":
      log.textContent += "\nScreen Distance Alert disable selected. Generating profile...";
      generateProfile("Disable Screen Distance", "screen-distance");
      break;
    case "06":
      log.textContent += "\nPasscode Finder selected. Attempting to simulate passcode recovery...";
      simulatePasscodeFinder();
      break;
    case "07":
      log.textContent += "\nEnable Discord selected. Generating profile...";
      generateProfile("Enable Discord", "enable-discord");
      break;
    default:
      log.textContent += "\n未対応または無効なコマンドです。";
  }
}

function generateProfile(name, type) {
  const uuid = crypto.randomUUID();
  let payloadContent = '';

  // ペイロードの内容をタイプに応じて変更
  switch (type) {
    case "app-limits":
    case "downtime":
    case "allow-all":
      payloadContent = `
        <dict>
          <key>PayloadType</key>
          <string>com.apple.applicationaccess</string>
          <key>PayloadVersion</key>
          <integer>1</integer>
          <key>PayloadIdentifier</key>
          <string>com.godtool.applicationaccess.${uuid}</string>
          <key>PayloadUUID</key>
          <string>${uuid}</string>
          <key>allowAppInstallation</key>
          <true/>
        </dict>`;
      break;
    case "safari-appstore":
      payloadContent = `
        <dict>
          <key>PayloadType</key>
          <string>com.apple.applicationaccess</string>
          <key>PayloadVersion</key>
          <integer>1</integer>
          <key>PayloadIdentifier</key>
          <string>com.godtool.applicationaccess.${uuid}</string>
          <key>PayloadUUID</key>
          <string>${uuid}</string>
          <key>allowAppInstallation</key>
          <true/>
          <key>allowSafari</key>
          <true/>
          <key>allowedApplications</key>
          <array>
            <string>com.apple.AppStore</string>
            <string>com.apple.mobilesafari</string>
          </array>
        </dict>`;
      break;
    case "screen-distance":
      payloadContent = `
        <dict>
          <key>PayloadType</key>
          <string>com.apple.screendistance</string>
          <key>PayloadVersion</key>
          <integer>1</integer>
          <key>PayloadIdentifier</key>
          <string>com.godtool.screendistance.${uuid}</string>
          <key>PayloadUUID</key>
          <string>${uuid}</string>
          <key>screenDistanceEnabled</key>
          <false/>
        </dict>`;
      break;
    case "enable-discord":
      payloadContent = `
        <dict>
          <key>PayloadType</key>
          <string>com.apple.applicationaccess</string>
          <key>PayloadVersion</key>
          <integer>1</integer>
          <key>PayloadIdentifier</key>
          <string>com.godtool.applicationaccess.${uuid}</string>
          <key>PayloadUUID</key>
          <string>${uuid}</string>
          <key>allowAppInstallation</key>
          <true/>
          <key>allowedApplications</key>
          <array>
            <string>com.hammerandchisel.discord</string>
          </array>
        </dict>`;
      break;
  }

  const profile = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
 "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>PayloadContent</key>
  <array>
    ${payloadContent}
  </array>
  <key>PayloadDisplayName</key>
  <string>${name}</string>
  <key>PayloadIdentifier</key>
  <string>com.godtool.${name.toLowerCase().replace(/\s+/g, '')}</string>
  <key>PayloadUUID</key>
  <string>${uuid}</string>
  <key>PayloadType</key>
  <string>Configuration</string>
  <key>PayloadVersion</key>
  <integer>1</integer>
</dict>
</plist>`;

  const blob = new Blob([profile], { type: 'application/x-apple-aspen-config' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = name.replace(/\s+/g, '_') + ".mobileconfig";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function simulatePasscodeFinder() {
  const log = document.getElementById("log");
  log.textContent += "\n⚠️ 注意: スクリーンタイムパスコードの特定は技術的に非常に困難です。";
  log.textContent += "\nこの機能はデモとして動作しますが、実際のパスコード特定はできません。";
  log.textContent += "\n代わりに、Appleの公式手順（Apple IDでリセット）を試してください。出来ないなら諦めろ";
  log.textContent += "\nシミュレーション開始";

  // ブルートフォースのシミュレーション（実際には動作しない）
  let attempts = 0;
  const maxAttempts = 10; // 試行回数の制限（デモ用）
  const interval = setInterval(() => {
    attempts++;
    const guess = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    log.textContent += `\n試行 ${attempts}: パスコード ${guess} をテスト中... (失敗)`;

    if (attempts >= maxAttempts) {
      clearInterval(interval);
      log.textContent += "\n試行回数の上限に達しました。";
      log.textContent += "\n公式手順: 設定 → スクリーンタイム → 'パスコードをお忘れですか？' からApple IDでリセットしてください。それが無理だったらお疲れ^ ^";
    }
  }, 1000);
}