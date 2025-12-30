"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from "ui";
import { useRouter } from "next/navigation";

export default function MonitorSummary() {
  const router = useRouter();

  const handleStartShift = () => {
    router.push("/monitor/dashboard");
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-6">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Shift Handover</CardTitle>
          <CardDescription className="text-base">
            Review pending issues before starting your shift
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Previous Shift Info */}
          <div className="rounded-lg border bg-muted/50 p-4">
            <h3 className="font-semibold mb-2">Previous Shift Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Operator:</span>
                <p className="font-medium">No previous shift</p>
              </div>
              <div>
                <span className="text-muted-foreground">Shift End:</span>
                <p className="font-medium">N/A</p>
              </div>
            </div>
          </div>

          {/* Pending Issues */}
          <div>
            <h3 className="font-semibold mb-3">Pending Issues</h3>
            <div className="rounded-lg border p-8 text-center">
              <p className="text-muted-foreground">No pending issues from previous shift</p>
            </div>
          </div>

          {/* Start Shift Button */}
          <div className="flex justify-center pt-4">
            <Button size="lg" onClick={handleStartShift} className="min-w-[200px]">
              Start Shift
            </Button>
          </div>

          {/* Notes */}
          <div className="text-center text-sm text-muted-foreground">
            <p>By starting your shift, you acknowledge the handover information above.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

