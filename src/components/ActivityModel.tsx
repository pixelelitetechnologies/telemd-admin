import React, { useEffect } from "react";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core/styles";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import {
  Button,
  Dialog,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: "absolute",
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
    listView: {},
  });

export type ModalProps = {
  openModal: boolean;
  handleClose: Function;
  data: any;
  type: string;
};

export interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          {/* <CloseIcon /> */}
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme: Theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default function ActivityModal(props: ModalProps) {
  let { openModal, handleClose, data } = props;
  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <div>
      <Dialog
        onClose={() => handleClose}
        maxWidth="md"
        fullWidth
        aria-labelledby="customized-dialog-title"
        open={openModal}
      >
        <DialogTitle id="customized-dialog-title" onClose={() => handleClose}>
          Audit Log
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Server Date/Time</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Method</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Details</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableCell>{data?.time}</TableCell>
                <TableCell>{data?.endPoint}</TableCell>
                <TableCell>{data?.userType}</TableCell>
              </TableBody>
            </Table>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => handleClose()} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
