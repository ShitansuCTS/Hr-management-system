import { getDashboardService } from "@/services/dashboard/admin/dashboard.service"

export async function getDashboardController(currentUser){
    const dashboardData = await getDashboardService(currentUser);

    return {
        success: true,
        messsage: "Dashboard data fetched successfully",
        data: dashboardData,
    };
}