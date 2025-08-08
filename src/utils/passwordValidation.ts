export interface PasswordValidation {
  isValid: boolean;
  errors: string[];
  strength: "weak" | "medium" | "strong";
}

export function validatePassword(password: string): PasswordValidation {
  const errors: string[] = [];

  // Kiểm tra độ dài
  if (password.length < 8) {
    errors.push("Mật khẩu phải có ít nhất 8 ký tự");
  }

  // Kiểm tra có chữ hoa
  if (!/[A-Z]/.test(password)) {
    errors.push("Mật khẩu phải có ít nhất 1 chữ cái viết hoa");
  }

  // Kiểm tra có chữ thường
  if (!/[a-z]/.test(password)) {
    errors.push("Mật khẩu phải có ít nhất 1 chữ cái viết thường");
  }

  // Kiểm tra có số
  if (!/\d/.test(password)) {
    errors.push("Mật khẩu phải có ít nhất 1 số");
  }

  // Kiểm tra có ký tự đặc biệt
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Mật khẩu phải có ít nhất 1 ký tự đặc biệt");
  }

  // Tính độ mạnh
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
