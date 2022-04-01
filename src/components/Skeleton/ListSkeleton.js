import React from "react";
import {Box, Skeleton} from "@mui/material";

export default function ListSkeleton() {
    return (
        <Box>
            {new Array(10).fill('').
            map((e, i) => (
                <Skeleton
                    key={i}
                    sx={{ mb: 2, borderRadius: 4 }}
                    height={70}
                    variant='rectangular'/>
            ))}
        </Box>
    )
}