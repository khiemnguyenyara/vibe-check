"use client";

import { Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GUEST_SESSION_LIMIT } from "@/lib/session/storage";

/**
 * PRD §3 — triggered only upon completing the 3rd session.
 *
 * Non-dismissible by construction: `open` is hard-coded true and
 * onOpenChange is not wired, so nothing the primitive does can close it.
 * disablePointerDismissal stops the outside-click attempt from even firing,
 * and the close button is suppressed. The summary stays readable behind the
 * backdrop — the guest earned that result and should not lose it to the wall.
 *
 * Auth is out of scope for this spec; the buttons are placeholders.
 */
export function LoginWall() {
  return (
    <Dialog open disablePointerDismissal>
      <DialogContent
        showCloseButton={false}
        className="border border-quest-surface-border shadow-[0_20px_60px_-20px_oklch(0_0_0/0.45)] sm:max-w-md"
      >
        <DialogHeader>
          <span className="flex size-10 items-center justify-center rounded-xl bg-interview-accent/15 text-interview-accent">
            <Lock className="size-5" />
          </span>
          <DialogTitle className="mt-3 text-lg font-extrabold">
            Bạn đã dùng hết {GUEST_SESSION_LIMIT} phiên miễn phí
          </DialogTitle>
          <DialogDescription className="mt-1.5 leading-relaxed">
            Đăng nhập để tiếp tục luyện tập không giới hạn, lưu lại lịch sử
            phỏng vấn và theo dõi tiến bộ của bạn theo thời gian.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 flex flex-col gap-2">
          <Button
            type="button"
            disabled
            className="w-full rounded-full border border-quest-surface-border bg-interview-accent text-interview-accent-foreground"
          >
            Đăng nhập
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled
            className="w-full rounded-full border border-quest-surface-border"
          >
            Tạo tài khoản mới
          </Button>
          <p className="mt-1 text-center text-[11px] text-muted-foreground">
            Tính năng đăng nhập sẽ sớm ra mắt.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
