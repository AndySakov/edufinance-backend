import { formatNumber } from ".";
import { format } from "date-fns";

export const generateNewUserEmail = (
  firstName: string,
  lastName: string,
  email: string,
  loginUrl: string,
  defaultPass: string,
): string => {
  return `<div style="width: 100%; height: 100%;padding-top:76.05px; background: #F9FAFB; justify-content: center; align-items: center; display: inline-flex">
  <div style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: center; gap: 24px; display: inline-flex">
    <div style="flex-direction: column; justify-content: flex-start; align-items: center; gap: 30px; display: flex">
      <div style="padding: 32px; background: white; box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.10); border-radius: 8px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 28px; display: flex">
        <div style="height: fit-content; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 32px; display: flex">
          <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 18px; display: flex">
            <div style="width: 380px; color: #1B1818; font-size: 21px; font-family:Inter sans-serif;; font-weight: 600; line-height: 25.20px; word-wrap: break-word">
              <h1 style="font-size:1.5rem;line-height:2rem;font-weight:700;">
						    <span style="color:#000000; ">Edu</span><span style="color:#4B5563;">Finance</span>
					    </h1>
            </div>
            <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 40px; display: flex">
              <div style="width: 380px; color: #1B1818; font-size: 14px; font-family: Inter; font-weight: 400; line-height: 21px; word-wrap: break-word">Dear ${firstName} ${lastName},<br/><br/>Welcome to Edu Finance!<br/>We are excited to have you on board. To get started, please log in to your account using the credentials provided below:</div>
            </div>
          </div>
          <div style="align-self: stretch; height: 127px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 16px; display: flex">
            <div style="color: #1B1818; font-size: 12px; font-family:Inter sans-serif;; font-weight: 400; word-wrap: break-word">Login Details:</div>
            <div style="align-self: stretch; height: 96px; padding-left: 16px; padding-right: 16px; padding-top: 18px; padding-bottom: 18px; background: #FAFAFA; border-radius: 16px; overflow: hidden; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 24px; display: flex">
              <div style="align-self: stretch; height: 18px; justify-content: space-between; align-items: flex-end; display: inline-flex">
                <div style="color: #75808A; font-size: 12px; font-family:Inter sans-serif;; font-weight: 400; word-wrap: break-word">Email:</div>
                <div style="justify-content: flex-start; align-items: center; gap: 12px; display: flex">
                  <div style="color: #1D1D1D; font-size: 14px; font-family:Inter sans-serif;; font-weight: 600; word-wrap: break-word">${email}</div>
                </div>
              </div>
              <div style="align-self: stretch; height: 18px; justify-content: space-between; align-items: flex-end; display: inline-flex">
                <div style="color: #75808A; font-size: 12px; font-family:Inter sans-serif;; font-weight: 400; word-wrap: break-word">Temporary Password:</div>
                <div style="justify-content: flex-start; align-items: center; gap: 12px; display: flex">
                  <div style="color: #1D1D1D; font-size: 14px; font-family:Inter sans-serif;; font-weight: 600; word-wrap: break-word">${defaultPass}</div>
                </div>
              </div>
            </div>
          </div>
          <div style="align-self: stretch; height: 50px; flex-direction: column; justify-content: flex-start; align-items: center; gap: 10px; display: flex">
            <div style="align-self: stretch; height: 50px; padding-left: 16px; padding-right: 16px; padding-top: 11px; padding-bottom: 11px; background: #101928; border-radius: 8px; justify-content: center; align-items: center; gap: 7.20px; display: inline-flex">
              <a href="${loginUrl}" style="color: white; font-size: 14px; font-family:Inter sans-serif;; font-weight: 600; line-height: 20.30px; word-wrap: break-word">Login</a>
            </div>
          </div>
          <div style="width: 380px; color: #1B1818; font-size: 14px; font-family: Inter; font-weight: 400; line-height: 21px; word-wrap: break-word; text-align: center;">For your security, we strongly recommend changing your password immediately after your first login</div>
        </div>
      </div>
    </div>
    <div style="text-align: center; color: #6B7280; font-size: 12px; font-family:Inter sans-serif;; font-weight: 400; word-wrap: break-word">© Edufinance 2024.</div>
  </div>
</div>
`;
};

export const generateResetPasswordEmail = (
  firstName: string,
  resetUrl: string,
): string => {
  return `<div style="width: 100%; height: 100%;padding-top:76.05px; background: #F9FAFB; justify-content: center; align-items: center; display: inline-flex">
  <div style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: center; gap: 24px; display: inline-flex">
    <div style="flex-direction: column; justify-content: flex-start; align-items: center; gap: 30px; display: flex">
      <div style="padding: 32px; background: white; box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.10); border-radius: 8px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 28px; display: flex">
        <div style="height: fit-content; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 32px; display: flex">
          <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 18px; display: flex">
            <div style="width: 380px; color: #1B1818; font-size: 21px; font-family:Inter sans-serif;; font-weight: 600; line-height: 25.20px; word-wrap: break-word">
              <h1 style="font-size:1.5rem;line-height:2rem;font-weight:700;">
						    <span style="color:#000000; ">Edu</span><span style="color:#4B5563;">Finance</span>
					    </h1>
            </div>
            <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 40px; display: flex">
              <div style="width: 380px; color: #1B1818; font-size: 14px; font-family: Inter; font-weight: 400; line-height: 21px; word-wrap: break-word">Dear ${firstName},<br/>
              <br/>We received a password reset request from you<br/>Click the link below to reset your password</div>
            </div>
          </div>
          <div style="align-self: stretch; height: 50px; flex-direction: column; justify-content: flex-start; align-items: center; gap: 10px; display: flex">
            <div style="align-self: stretch; height: 50px; padding-left: 16px; padding-right: 16px; padding-top: 11px; padding-bottom: 11px; background: #101928; border-radius: 8px; justify-content: center; align-items: center; gap: 7.20px; display: inline-flex">
              <a href="${resetUrl}" style="color: white; font-size: 14px; font-family:Inter sans-serif;; font-weight: 600; line-height: 20.30px; word-wrap: break-word">Reset Password</a>
            </div>
          </div>
          <div style="width: 380px; color: #1B1818; font-size: 14px; font-family: Inter; font-weight: 400; line-height: 21px; word-wrap: break-word; text-align: center;">If this was not you, please ignore this email</div>
        </div>
      </div>
    </div>
    <div style="text-align: center; color: #6B7280; font-size: 12px; font-family:Inter sans-serif;; font-weight: 400; word-wrap: break-word">© Edufinance 2024.</div>
  </div>
</div>
`;
};

export const generateNewBillEmail = (
  firstName: string,
  dueDate: Date,
): string => {
  return `<div style="width: 100%; height: 100%;padding-top:76.05px; background: #F9FAFB; justify-content: center; align-items: center; display: inline-flex">
  <div style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: center; gap: 24px; display: inline-flex">
    <div style="flex-direction: column; justify-content: flex-start; align-items: center; gap: 30px; display: flex">
      <div style="padding: 32px; background: white; box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.10); border-radius: 8px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 28px; display: flex">
        <div style="height: fit-content; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 32px; display: flex">
          <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 18px; display: flex">
            <div style="width: 380px; color: #1B1818; font-size: 21px; font-family:Inter sans-serif;; font-weight: 600; line-height: 25.20px; word-wrap: break-word">
              <h1 style="font-size:1.5rem;line-height:2rem;font-weight:700;">
						    <span style="color:#000000;">Edu</span><span style="color:#4B5563;">Finance</span>
					    </h1>
            </div>
            <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 40px; display: flex">
              <div style="width: 380px; color: #1B1818; font-size: 14px; font-family: Inter; font-weight: 400; line-height: 21px; word-wrap: break-word">
              Dear ${firstName},<br/><br/>A new bill has been created for you!<br/>This new bill is due by ${format(dueDate, "MMMM dd, yyyy")}.<br/>Please login to your account before then to view the bill and pay it
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style="text-align: center; color: #6B7280; font-size: 12px; font-family:Inter sans-serif;; font-weight: 400; word-wrap: break-word">© Edufinance 2024.</div>
  </div>
</div>`;
};

export const generateNewFinancialAidApplicationEmail = (
  applicantName: string,
): string => {
  return `<div style="width: 100%; height: 100%;padding-top:76.05px; background: #F9FAFB; justify-content: center; align-items: center; display: inline-flex">
  <div style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: center; gap: 24px; display: inline-flex">
    <div style="flex-direction: column; justify-content: flex-start; align-items: center; gap: 30px; display: flex">
      <div style="padding: 32px; background: white; box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.10); border-radius: 8px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 28px; display: flex">
        <div style="height: fit-content; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 32px; display: flex">
          <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 18px; display: flex">
            <div style="width: 380px; color: #1B1818; font-size: 21px; font-family:Inter sans-serif;; font-weight: 600; line-height: 25.20px; word-wrap: break-word">
              <h1 style="font-size:1.5rem;line-height:2rem;font-weight:700;">
						    <span style="color:#000000;">Edu</span><span style="color:#4B5563;">Finance</span>
					    </h1>
            </div>
            <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 40px; display: flex">
              <div style="width: 380px; color: #1B1818; font-size: 14px; font-family: Inter; font-weight: 400; line-height: 21px; word-wrap: break-word">
              Dear ${applicantName},<br/><br/>
              We have received a new application for financial aid from you.<br/>
              We will review your application and get back to you as soon as possible.<br/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style="text-align: center; color: #6B7280; font-size: 12px; font-family:Inter sans-serif;; font-weight: 400; word-wrap: break-word">© Edufinance 2024.</div>
  </div>
</div>`;
};

export const generateNewFinancialAidApplicationVerdictEmail = (
  applicantName: string,
  verdict: "approved" | "rejected",
): string => {
  return `<div style="width: 100%; height: 100%;padding-top:76.05px; background: #F9FAFB; justify-content: center; align-items: center; display: inline-flex">
  <div style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: center; gap: 24px; display: inline-flex">
    <div style="flex-direction: column; justify-content: flex-start; align-items: center; gap: 30px; display: flex">
      <div style="padding: 32px; background: white; box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.10); border-radius: 8px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 28px; display: flex">
        <div style="height: fit-content; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 32px; display: flex">
          <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 18px; display: flex">
            <div style="width: 380px; color: #1B1818; font-size: 21px; font-family:Inter sans-serif;; font-weight: 600; line-height: 25.20px; word-wrap: break-word">
              <h1 style="font-size:1.5rem;line-height:2rem;font-weight:700;">
						    <span style="color:#000000;">Edu</span><span style="color:#4B5563;">Finance</span>
					    </h1>
            </div>
            <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 40px; display: flex">
              <div style="width: 380px; color: #1B1818; font-size: 14px; font-family: Inter; font-weight: 400; line-height: 21px; word-wrap: break-word">
              Dear ${applicantName},<br/><br/>
             ${verdict === "approved" ? "Congratulations! Your application for financial aid has been approved.<br/> Login to your dashboard to see what discounts you have been approved for." : "We have rejected your application for financial aid.<br/>Please contact us if you have further questions about why your application might've been rejected."}<br/>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style="text-align: center; color: #6B7280; font-size: 12px; font-family:Inter sans-serif;; font-weight: 400; word-wrap: break-word">© Edufinance 2024.</div>
  </div>
</div>`;
};

export const generateNewReceiptEmail = (
  studentName: string,
  amountDue: number,
  dateOfPayment: Date,
  billName: string,
  feeSummary: {
    subTotal: number;
    discountsApplied: { name: string; amount: number }[];
    amountPaid: number;
  },
): string => {
  return `<div style="width: 100%; height: 100%;padding-top:76.05px; background: #F9FAFB; justify-content: center; align-items: center; display: inline-flex">
  <div style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: center; gap: 24px; display: inline-flex">
    <div style="flex-direction: column; justify-content: flex-start; align-items: center; gap: 30px; display: flex">
      <div style="padding: 32px; background: white; box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.10); border-radius: 8px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 28px; display: flex">
        <div style="height: fit-content; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 32px; display: flex">
          <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 18px; display: flex">
            <div style="width: 380px; color: #1B1818; font-size: 21px; font-family:Inter sans-serif;; font-weight: 600; line-height: 25.20px; word-wrap: break-word">
              <h1 style="font-size:1.5rem;line-height:2rem;font-weight:700;">
						    <span style="color:#000000; ">Edu</span><span style="color:#4B5563;">Finance</span>
					    </h1>
            </div>
            <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 40px; display: flex">
              <div style="width: 380px; color: #1B1818; font-size: 14px; font-family: Inter; font-weight: 400; line-height: 21px; word-wrap: break-word">Dear ${studentName},<br/><br/>We have just received a new payment from you for ${billName}!<br/>You can view the payment information on your dashboard under the "Payment History" tab.</div>
            </div>
          </div>
          <div style="display:grid;padding:1.5rem;padding-top:0;gap:1rem;">
				<div style="display:grid;gap:.25rem;">
					<div style="font-weight:600;color:#4d4d4d;font-size:1rem;line-height:2rem;">Student Name</div>
					<div style="font-weight:500;">${studentName}</div>
				</div>
				<div style="display:grid;gap:.25rem;">
					<div style="font-weight:600;color:#4d4d4d;font-size:1rem;line-height:2rem;">Amount Paid</div>
					<div style="font-weight:500;font-size:1rem;line-height:2rem;">${formatNumber(amountDue)}</div>
				</div>
				<div style="display:grid;gap:.25rem;">
					<div style="font-weight:600;color:#4d4d4d;font-size:1rem;line-height:2rem;">Date of Payment</div>
					<div style="font-weight:500;">${format(dateOfPayment, "MMMM dd, yyyy")}</div>
				</div>
				<div data-orientation="horizontal" role="none" style="shrink:0;width:100%;height:1px;background-color:#c4ccd4;"></div>
				<div style="display:grid;">
					<div style="font-weight:600;">Fee Summary</div>
					<ul style="display:grid;gap:.5rem;">
						<li style="display:flex;justify-content:space-between;align-items:center;">
							<span>${billName}</span>
              <span>${formatNumber(feeSummary.subTotal)}</span>
						</li>
						${feeSummary.discountsApplied
              .map(
                discount => `<li style="display:flex;justify-content:space-between;align-items:center;">
							<span>Discount (${discount.name})</span>
							<span> -${formatNumber(discount.amount)}</span>`,
              )
              .join("")}
						<li style="display:flex;justify-content:space-between;align-items:center;font-weight:500;">
							<span>Total</span>
							<span>${formatNumber(feeSummary.amountPaid)}</span>
						</li>
					</ul>
				</div>
			</div>
        </div>
      </div>
    </div>
    <div style="text-align: center; color: #6B7280; font-size: 12px; font-family:Inter sans-serif;; font-weight: 400; word-wrap: break-word">© Edufinance 2024.</div>
  </div>
</div>
`;
};
