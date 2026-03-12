'use client';

import { useActionState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { sendFeedbackAction, type FeedbackActionState } from '@/app/[lang]/contacts/actions';
import styles from '@/app/[lang]/contacts/page.module.css';

type Props = {
  locale: string;
  fullNameLabel: string;
  fullNamePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  commentLabel: string;
  commentPlaceholder: string;
  submit: string;
  submitSending: string;
  errorRequired: string;
  errorServiceUnavailable: string;
  errorSendFailed: string;
  errorNetwork: string;
};

const initialFeedbackActionState: FeedbackActionState = {
  status: 'idle',
};

export default function FeedbackForm({
  locale,
  fullNameLabel,
  fullNamePlaceholder,
  emailLabel,
  emailPlaceholder,
  commentLabel,
  commentPlaceholder,
  submit,
  submitSending,
  errorRequired,
  errorServiceUnavailable,
  errorSendFailed,
  errorNetwork,
}: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [state, formAction, isPending] = useActionState<FeedbackActionState, FormData>(
    sendFeedbackAction,
    initialFeedbackActionState,
  );

  const isSuccess = state.status === 'success';
  const isError = state.status === 'error';

  useEffect(() => {
    if (isSuccess) {
      formRef.current?.reset();
      router.push(`/${locale}/contacts?status=thanks`);
    }
  }, [isSuccess, locale, router]);

  const submitLabel = isPending ? submitSending : submit;

  const errorMessage =
    state.errorCode === 'missing_fields'
      ? errorRequired
      : state.errorCode === 'not_configured'
        ? errorServiceUnavailable
        : state.errorCode === 'send_failed'
          ? errorSendFailed
          : state.errorCode === 'network'
            ? errorNetwork
            : '';

  return (
    <form ref={formRef} className={styles.form} action={formAction}>
      <label className={styles.label}>
        {fullNameLabel}
        <input className={styles.input} type="text" name="fullName" placeholder={fullNamePlaceholder} required />
      </label>

      <label className={styles.label}>
        {emailLabel}
        <input className={styles.input} type="email" name="email" placeholder={emailPlaceholder} required />
      </label>

      <label className={styles.label}>
        {commentLabel}
        <textarea
          className={styles.textarea}
          rows={4}
          name="comment"
          placeholder={commentPlaceholder}
          required
        />
      </label>

      <motion.button
        type="submit"
        className={`${styles.submitButton} ${isError ? styles.submitError : ''}`}
        disabled={isPending}
        animate={{ scale: 1 }}
      >
        <div className={styles.glow}></div>
        <div className={styles.borderWrapper}>
          <div className={`${styles.stroke} ${styles.strokeDefault}`}></div>
          <div className={`${styles.stroke} ${styles.strokeHover}`}></div>
        </div>
        <div className={styles.innerFill}></div>
        <span className={styles.submitLabel}>{submitLabel}</span>
      </motion.button>

      {errorMessage ? (
        <motion.p
          className={`${styles.formNotice} ${styles.formNoticeError}`}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          role="alert"
          aria-live="polite"
        >
          {errorMessage}
        </motion.p>
      ) : null}
    </form>
  );
}
