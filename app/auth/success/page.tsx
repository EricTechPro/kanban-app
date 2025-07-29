"use client";

import {
  useEffect,
  useSearchParams,
} from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function AuthSuccessPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      // Store JWT token
      localStorage.setItem("jwt_token", token);

      // Send success message to parent window
      if (window.opener) {
        window.opener.postMessage(
          {
            type: "OAUTH_SUCCESS",
            token: token,
          },
          window.location.origin
        );
        window.close();
      } else {
        // If not in popup, redirect to dashboard
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 2000);
      }
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-green-900">
            Authentication Successful!
          </CardTitle>
          <CardDescription>
            Your Gmail account has been connected
            successfully.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground">
            {window.opener
              ? "This window will close automatically..."
              : "Redirecting to dashboard..."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
