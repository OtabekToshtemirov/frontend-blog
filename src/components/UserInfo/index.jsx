import React from 'react';
import styles from './UserInfo.module.scss';

export const UserInfo = ({ avatarUrl, fullname, additionalText }) => {
  return (
    <div className={styles.root}>
      <img className={styles.avatar} src={avatarUrl || '/noavatar.png'} alt={fullname} />
      <div className={styles.userDetails}>
        <span className={styles.userName}>{fullname}</span>
        <span className={styles.additional}>{additionalText}</span>
      </div>
    </div>
  );
};
