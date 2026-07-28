import { validateCreateLeaveComment } from "@/validations/leaveComment.validation";

import { createLeaveCommentService, getLeaveCommentsService } from "@/services/leave/leaveComment.service";

export async function createLeaveCommentController(body, leaveId, currentUser) {
  const commentData = validateCreateLeaveComment(body);

  const comment = await createLeaveCommentService(commentData, leaveId, currentUser);

  return {
    success: true,
    message: "Comment added successfully",
    data: comment,
  };
}

export async function getLeaveCommentsController(leaveId, currentUser) {
  const comments = await getLeaveCommentsService(leaveId, currentUser);

  return {
    success: true,
    message: "Comments fetched successfully",
    data: comments,
  };
}
