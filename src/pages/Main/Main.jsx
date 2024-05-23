import React from "react";

function Home({ user }) {
  return (
    <div style={{ fontSize: "24px" }}>
      <p>ID: {user.id}</p>
      <p>이름: {user.userName}</p>
      <p>은행: {user.bankName}</p>
      <p>계좌: {user.bankAccount}</p>
      <p>캐릭터ID: {user.profileImg}</p>
      
    </div>
  );
}

export default Home;