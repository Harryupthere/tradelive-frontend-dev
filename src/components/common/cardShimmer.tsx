import { Card, CardContent, Skeleton } from "@mui/material";

const CardShimmer = () => {
  return (
    <Card
      className="course-card"
      sx={{
        backgroundColor: "#1c1c1c", // match your dark theme card background
        borderRadius: 2,
        boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
      }}
    >
      <Skeleton
        variant="rectangular"
        height={180}
        sx={{
          borderRadius: 2,
          bgcolor: "rgba(255,255,255,0.08)", // dark gray base shimmer
          "&::after": {
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
          },
        }}
      />
      <CardContent>
        <Skeleton
          variant="text"
          width="70%"
          height={25}
          sx={{ bgcolor: "rgba(255,255,255,0.1)" }}
        />
        <Skeleton
          variant="text"
          width="90%"
          height={15}
          sx={{ bgcolor: "rgba(255,255,255,0.1)" }}
        />
        <Skeleton
          variant="text"
          width="60%"
          height={15}
          sx={{ bgcolor: "rgba(255,255,255,0.1)" }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 10,
          }}
        >
          <Skeleton
            variant="text"
            width={80}
            height={20}
            sx={{ bgcolor: "rgba(255,255,255,0.1)" }}
          />
          <Skeleton
            variant="text"
            width={100}
            height={20}
            sx={{ bgcolor: "rgba(255,255,255,0.1)" }}
          />
        </div>
        <Skeleton
          variant="rectangular"
          width="100%"
          height={36}
          sx={{
            borderRadius: 1,
            marginTop: 2,
            bgcolor: "rgba(255,255,255,0.1)",
          }}
        />
      </CardContent>
    </Card>
  );
};

export default CardShimmer;
