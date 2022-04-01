import React from "react";
import {Box, Grid, Skeleton} from "@mui/material";

export default function FormSkeleton() {
    return (
        <Box>
            <Grid container spacing={3}>
                {new Array(6).fill('').
                map(i => (
                    <Grid key={i} item lg={6} sm={12} xs={12}>
                        <Skeleton
                            sx={{ borderRadius: 3 }}
                            height={45}
                            variant='rectangular'/>
                    </Grid>
                ))}
                <Grid item lg={12} sm={12} xs={12}>
                    <Skeleton
                        sx={{ borderRadius: 5 }}
                        height={200}
                        variant='rectangular'/>
                </Grid>
            </Grid>
        </Box>
    )
}