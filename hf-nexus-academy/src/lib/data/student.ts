import { prisma } from "@/lib/prisma";

export async function getStudentByUserId(userId: string) {
  return prisma.student.findUnique({
    where: { userId },
    include: { user: true },
  });
}

export async function getStudentDashboardData(studentId: string) {
  const [enrollments, upcomingAssignments, recentNotifications, certificates] = await Promise.all([
    prisma.enrollment.findMany({
      where: { studentId },
      include: { course: { include: { teacher: { include: { user: true } } } } },
      orderBy: { startedAt: "desc" },
    }),
    prisma.assignment.findMany({
      where: {
        submissions: { none: { studentId } },
      },
      include: { lesson: { include: { course: true } } },
      orderBy: { dueAt: "asc" },
      take: 5,
    }),
    prisma.notification.findMany({
      where: { user: { student: { id: studentId } } },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.certificate.findMany({
      where: { studentId },
      orderBy: { issuedAt: "desc" },
    }),
  ]);

  return { enrollments, upcomingAssignments, recentNotifications, certificates };
}

export async function getStudentEnrollments(studentId: string) {
  return prisma.enrollment.findMany({
    where: { studentId },
    include: {
      course: {
        include: {
          teacher: { include: { user: true } },
          modules: { include: { lessons: { orderBy: { order: "asc" } } }, orderBy: { order: "asc" } },
          lessons: { orderBy: { order: "asc" } },
        },
      },
    },
    orderBy: { startedAt: "desc" },
  });
}

export async function getEnrollmentByCourseSlug(studentId: string, slug: string) {
  return prisma.enrollment.findFirst({
    where: { studentId, course: { slug } },
    include: {
      course: {
        include: {
          teacher: { include: { user: true } },
          modules: { include: { lessons: { orderBy: { order: "asc" } } }, orderBy: { order: "asc" } },
          lessons: { orderBy: { order: "asc" } },
        },
      },
    },
  });
}

export async function getStudentAssignments(studentId: string) {
  const submissions = await prisma.submission.findMany({
    where: { studentId },
    include: { assignment: { include: { lesson: { include: { course: true } } } } },
    orderBy: { submittedAt: "desc" },
  });

  const allAssignmentsForEnrolledCourses = await prisma.assignment.findMany({
    where: {
      lesson: {
        course: {
          enrollments: { some: { studentId } },
        },
      },
    },
    include: { lesson: { include: { course: true } } },
    orderBy: { dueAt: "asc" },
  });

  const submittedIds = new Set(submissions.map((s) => s.assignmentId));
  const pending = allAssignmentsForEnrolledCourses.filter((a) => !submittedIds.has(a.id));

  return { submissions, pending };
}

export async function getStudentAttendance(studentId: string) {
  return prisma.attendance.findMany({
    where: { studentId },
    include: { teacher: { include: { user: true } } },
    orderBy: { date: "desc" },
    take: 50,
  });
}

export async function getStudentNotes(studentId: string) {
  return prisma.studentNote.findMany({
    where: { studentId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getStudentCertificates(studentId: string) {
  return prisma.certificate.findMany({
    where: { studentId },
    orderBy: { issuedAt: "desc" },
  });
}
