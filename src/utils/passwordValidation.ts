export interface PasswordValidation {
  isValid: boolean;
  errors: string[];
  strength: "weak" | "medium" | "strong";
}

export function validatePassword(password: string): PasswordValidation {
  const errors: string[] = [];

  
  if (password.length < 8) {
    errors.push("Mật khẩu phải có ít nhất 8 ký tự");
  }

  
  if (!/[A-Z]/.test(password)) {
    errors.push("Mật khẩu phải có ít nhất 1 chữ cái viết hoa");
  }

  
  if (!/[a-z]/.test(password)) {
    errors.push("Mật khẩu phải có ít nhất 1 chữ cái viết thường");
  }

  
  if (!/\d/.test(password)) {
    errors.push("Mật khẩu phải có ít nhất 1 số");
  }

  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Mật khẩu phải có ít nhất 1 ký tự đặc biệt");
  }

  
  let strength: "weak" | "medium" | "strong" = "weak";
  if (errors.length === 0) {
    if (
      password.length >= 12 &&
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    ) {
      strength = "strong";
    } else {
      strength = "medium";
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength,
  };
}

export function getPasswordStrengthColor(
  strength: "weak" | "medium" | "strong"
): string {
  switch (strength) {
    case "weak":
      return "text-red-500";
    case "medium":
      return "text-yellow-500";
    case "strong":
      return "text-green-500";
  }
}

export function getPasswordStrengthText(
  strength: "weak" | "medium" | "strong"
): string {
  switch (strength) {
    case "weak":
      return "Yếu";
    case "medium":
      return "Trung bình";
    case "strong":
      return "Mạnh";
  }
}
