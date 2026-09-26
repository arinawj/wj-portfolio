import React, { useEffect, useState } from "react";
import { signInAsEditor, signOutEditor, subscribeToCloudUser, uploadCurrentLocalContent } from "./cloudStorage.js";

export default function CloudSyncControl() {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("");
  const adminRequested = ["admin", "edit", "copy"].some((key) => new URLSearchParams(window.location.search).has(key));

  useEffect(() => subscribeToCloudUser((nextUser) => {
    setUser(nextUser);
    document.documentElement.classList.toggle("wj-admin-mode", adminRequested || Boolean(nextUser));
  }), [adminRequested]);

  const run = async (action, success) => {
    setStatus("처리 중...");
    try {
      await action();
      setStatus(success);
    } catch (error) {
      setStatus(error.message || "처리하지 못했습니다.");
    }
  };

  if (!adminRequested && !user) return null;

  return (
    <aside className="cloud-sync-control" aria-label="온라인 편집 동기화">
      {user ? (
        <>
          <strong>온라인 편집 연결됨</strong>
          <button type="button" onClick={() => run(uploadCurrentLocalContent, "현재 내용 저장 완료")}>현재 내용 온라인 저장</button>
          <button type="button" className="cloud-sync-quiet" onClick={() => run(signOutEditor, "로그아웃됨")}>로그아웃</button>
        </>
      ) : (
        <button type="button" onClick={() => run(signInAsEditor, "로그인 완료")}>관리자 로그인</button>
      )}
      {status ? <span>{status}</span> : null}
    </aside>
  );
}
