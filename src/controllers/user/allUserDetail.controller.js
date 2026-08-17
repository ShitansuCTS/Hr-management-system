import { validateCreateUser } from "@/validations/user.validation";
import {
  createUserService,
  getAllUsersDetailsService,
} from "@/services/user/allUserDetail.service";

export async function createUserController(request, currentUser) {
  const formData = await request.formData();

  const userData = validateCreateUser(formData);

  const user = await createUserService(userData, currentUser);

  return {
    success: true,
    message: "User created successfully",
    data: user,
  };
}

export async function getAllUsersDetailsController(currentUser ,departmentId) {
  const users = await getAllUsersDetailsService(currentUser, departmentId);

  return {
    success: true,
    message: "All users details fetched successfully",
    data: users,
  };
}
