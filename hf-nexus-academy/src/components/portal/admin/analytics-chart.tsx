"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function EnrollmentsByCourseChart({ data }: { data: { name: string; enrollments: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 40 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E0D5" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: "#5B6377" }}
          angle={-35}
          textAnchor="end"
          interval={0}
        />
        <YAxis tick={{ fontSize: 11, fill: "#5B6377" }} allowDecimals={false} />
        <Tooltip
          contentStyle={{ backgroundColor: "#0A1628", border: "none", borderRadius: 6, fontSize: 12 }}
          itemStyle={{ color: "#FAF8F3" }}
          labelStyle={{ color: "#E3CD96" }}
        />
        <Bar dataKey="enrollments" fill="#C9A961" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
