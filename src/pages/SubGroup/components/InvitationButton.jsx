import styled from "@emotion/styled";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";
import api from 'utils/apiInstance';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { CancelOutlined, CheckCircleOutlined } from '@mui/icons-material';
import { useEffect, useState } from "react";

const InvitationButtonContainer = styled.div`
  position: absolute;
  top: 426px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0;
`;

const InvitationButton = styled(Button)`
  background-color: #f8a809;
  color: #ffffff;
  font-weight: bold;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 14px;
  text-transform: none;
  display: flex;
  align-items: center;
  &:hover {
    background-color: #e09a07;
  }
`;

const UnsubscribeLink = styled.a`
  color: red;
  margin-left: 10px;
  cursor: pointer;
`;

const InvitationButtonComponent = ({ groupData, user }) => {
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [isUserSubscribed, setIsUserSubscribed] = useState(false);
  const userId = user.id; 

  useEffect(() => {
    if (user && userId) {
      const isSubscribed = groupData.members.some(user => user.userId === userId);
      setIsUserSubscribed(isSubscribed);
    }
  }, [groupData.members, userId, user]);
  const copyInvitationCode = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(groupData.inviteCode)
        .then(() => {
          toast.success("클립보드에 초대코드가 복사되었습니다.", {
            position: "top-center",
            autoClose: 300,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
          });
        })
        .catch((err) => {
          console.error("Failed to copy invitation code: ", err);
          fallbackCopyInvitationCode();
        });
    } else {
      fallbackCopyInvitationCode();
    }
  };
  
  const fallbackCopyInvitationCode = () => {
    const tempInput = document.createElement('input');
    tempInput.value = groupData.inviteCode;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
  
    toast.success("클립보드에 초대코드가 복사되었습니다.", {
      position: "top-center",
      autoClose: 300,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
    });
  };

  const handleUnsubscribe = async () => {
    setOpenConfirmDialog(true);
  };

  const handleConfirmUnsubscribe = async () => {
    try {
      const { data } = await api("mygrp").delete(`/my-groups/${groupData.groupId}?userId=${user.id}`);
      if (data.code === 200) {
        toast.success('썹 참여를 취소했어요', {
          autoClose: 500,
          onClose: () => window.location.reload(),
        });
      } else {
        toast.error(data.message, {
          autoClose: 500,
        });
      }
    } catch (err) {
      toast.error(err.message || '썹 참여 취소에 실패했습니다.', {
        autoClose: 500,
      });
    }
    setOpenConfirmDialog(false);
  };

  const handleCancelUnsubscribe = () => {
    setOpenConfirmDialog(false);
  };

  return (
    <>
    
      { groupData.members.length < groupData.maxShareNum ? (
        <InvitationButtonContainer>
          <InvitationButton onClick={copyInvitationCode}>
            초대코드 복사하기
          </InvitationButton>
          {isUserSubscribed && (
            <UnsubscribeLink onClick={handleUnsubscribe}>참여취소</UnsubscribeLink>
          )}
        </InvitationButtonContainer>
      ) : (
        <InvitationButtonContainer>
          <span style={{ fontSize: "18px", fontWeight: "bold" }}>
            멤버 구성 완료
            {isUserSubscribed && (
              <UnsubscribeLink onClick={handleUnsubscribe}>참여취소</UnsubscribeLink>
            )}
          </span>
        </InvitationButtonContainer>
      )}
    
      <Dialog open={openConfirmDialog} onClose={handleCancelUnsubscribe}>
        <DialogTitle>
          <CheckCircleOutlined color="warning" sx={{ marginRight: 1 }} />
          가입 취소 확인
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            정말 가입을 취소하시겠습니까?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelUnsubscribe} color="inherit">
            <CancelOutlined sx={{ marginRight: 1 }} />
            취소
          </Button>
          <Button onClick={handleConfirmUnsubscribe} color="error" autoFocus>
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default InvitationButtonComponent;