import React, { Suspense } from "react";
import VerifyOtpForm from "../_common/verify-otp-form";

const VerifyEmailPage = () => {
  return (
    <Suspense>
      <VerifyOtpForm />
    </Suspense>
  );
};

export default VerifyEmailPage;
