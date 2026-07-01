import { prisma } from "@/lib/prisma";

export async function getAdminAnalytics() {
  const [
    totalStudents,
    totalTeachers,
    totalCourses,
    activeEnrollments,
    totalRevenueResult,
    pendingLeads,
    newLeadsThisMonth,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.user.count({ where: { role: "TEACHER" } }),
    prisma.course.count(),
    prisma.enrollment.count({ where: { status: "ACTIVE" } }),
    prisma.payment.aggregate({
      where: { status: "SUCCEEDED" },
      _sum: { amountCents: true },
    }),
    prisma.contactLead.count({ where: { status: "NEW" } }),
    prisma.contactLead.count({
      where: { createdAt: { gte: new Date(new Date().setDate(1)) } },
    }),
  ]);

  return {
    totalStudents,
    totalTeachers,
    totalCourses,
    activeEnrollments,
    totalRevenueCents: totalRevenueResult._sum.amountCents ?? 0,
    pendingLeads,
    newLeadsThisMonth,
  };
}

export async function getAllStudents() {
  return prisma.student.findMany({
    include: {
      user: true,
      enrollments: { include: { course: true } },
    },
    orderBy: { joinedAt: "desc" },
  });
}

export async function getStudentFullDetail(studentId: string) {
  return prisma.student.findUnique({
    where: { id: studentId },
    include: {
      user: true,
      enrollments: { include: { course: true } },
      payments: { orderBy: { createdAt: "desc" } },
      certificates: true,
    },
  });
}

export async function getAllTeachers() {
  return prisma.teacher.findMany({
    include: {
      user: true,
      courses: { include: { enrollments: true } },
    },
    orderBy: { displayOrder: "asc" },
  });
}

export async function getTeacherFullDetail(teacherId: string) {
  return prisma.teacher.findUnique({
    where: { id: teacherId },
    include: {
      user: true,
      courses: { include: { enrollments: true } },
    },
  });
}

export async function getAllCourses() {
  return prisma.course.findMany({
    include: {
      teacher: { include: { user: true } },
      enrollments: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAllTeachersForSelect() {
  return prisma.teacher.findMany({
    include: { user: true },
    orderBy: { user: { name: "asc" } },
  });
}

export async function getAllPayments() {
  return prisma.payment.findMany({
    include: { student: { include: { user: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

export async function getAllAttendanceRecords() {
  return prisma.attendance.findMany({
    include: {
      student: { include: { user: true } },
      teacher: { include: { user: true } },
    },
    orderBy: { date: "desc" },
    take: 100,
  });
}

export async function getAllTestimonials() {
  return prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getAllBlogPosts() {
  return prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getBlogPostById(id: string) {
  return prisma.blogPost.findUnique({ where: { id } });
}

export async function getAllAnnouncements() {
  return prisma.announcement.findMany({ orderBy: { createdAt: "desc" }, take: 50 });
}

export async function getAllContactLeads() {
  return prisma.contactLead.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
}
