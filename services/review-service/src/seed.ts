import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding reviews...");

  // Delete existing
  try {
     await prisma.review.deleteMany();
  } catch (e) {
     console.log("No existing reviews or table not found, continuing...");
  }

  const reviews = [
    {
      userName: "Marcus Thorne",
      userAvatar: "https://i.pravatar.cc/150?img=11",
      carName: "Porsche Taycan Turbo",
      carCategory: "Electric",
      rating: 5,
      title: "Incredible performance and seamless pickup",
      comment: "The Taycan was in pristine condition. The ERP portal made the booking process incredibly smooth. Pickup at the airport took less than 5 minutes. Truly a premium experience from start to finish. Battery was at 95% upon arrival.",
      isVerified: true,
      helpfulCount: 24,
    },
    {
      userName: "Sarah Jenkins",
      userAvatar: "https://i.pravatar.cc/150?img=32",
      carName: "Audi Q8 e-tron",
      carCategory: "SUV",
      rating: 4,
      title: "Perfect for family road trips",
      comment: "Spacious and very comfortable for our 500-mile trip. The infotainment system was great for the kids. Only minor issue was the charger cable in the trunk was a bit tangled, but everything worked perfectly.",
      isVerified: true,
      helpfulCount: 12,
    },
    {
      userName: "David Chen",
      userAvatar: "https://i.pravatar.cc/150?img=12",
      carName: "Tesla Model 3",
      carCategory: "Electric",
      rating: 5,
      title: "Smooth and efficient",
      comment: "Autopilot worked flawlessly on the highway. Highly recommend for business trips.",
      isVerified: true,
      helpfulCount: 8,
    }
  ];

  for (const review of reviews) {
    await prisma.review.create({ data: review });
  }

  console.log("Seeding finished!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
