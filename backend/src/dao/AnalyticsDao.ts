import { Analytics, Prisma, PrismaClient } from "@prisma/client";

export class AnalyticsDao {
  constructor(private prismaClient: PrismaClient = new PrismaClient()) {}

  public async createAnalytics(
    analyticsData: Prisma.AnalyticsCreateInput
  ): Promise<Analytics> {
    return this.prismaClient.analytics.create({
      data: analyticsData,
    });
  }

  public async getAllAnalytics(): Promise<Analytics[]> {
    return this.prismaClient.analytics.findMany();
  }

  public async getAnalyticsById(
    analyticsId: string
  ): Promise<Analytics | null> {
    return this.prismaClient.analytics.findUnique({
      where: { id: analyticsId },
      include: {
        course: true,
      },
    });
  }

  public async updateAnalytics(
    analyticsId: string,
    analyticsData: Prisma.AnalyticsUpdateInput
  ): Promise<Analytics | null> {
    return this.prismaClient.analytics.update({
      where: { id: analyticsId },
      data: analyticsData,
    });
  }

  public async deleteAnalytics(analyticsId: string): Promise<Analytics | null> {
    return this.prismaClient.analytics.delete({
      where: { id: analyticsId },
    });
  }
}
