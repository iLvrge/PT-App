import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  useMemo,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { Paper } from "@material-ui/core";
import moment from "moment";

import useStyles from "./styles";
import _orderBy from "lodash/orderBy";
import VirtualizedTable from "../VirtualizedTable";
import { DEFAULT_CUSTOMERS_LIMIT } from "../../../api/patenTrack2";

import {
  setMainCompaniesRowSelect,
  setAssetTypeSelectedRow,
  setAssetTypeCustomerSelectedRow,
  setSelectedAssetsTransactions,
  setChildSelectedAssetsTransactions,
  setChildSelectedAssetsPatents,
  setSlackMessages,
} from "../../../actions/patentTrackActions2";

import {
  setConnectionBoxView,
  setPDFView,
} from "../../../actions/patenTrackActions";

import {
  toggleUsptoMode,
  toggleShow3rdParities,
  toggleFamilyMode,
  toggleFamilyItemMode,
  toggleLifeSpanMode,
} from "../../../actions/uiActions";

import { numberWithCommas } from "../../../utils/numbers";

import { getTokenStorage } from "../../../utils/tokenStorage";

import Loader from "../Loader";

const COLUMNS = [
  {
    width: 29,
    label: "",
    dataKey: "appno_doc_num",
    role: "checkbox",
  },
  {
    width: 80,
    label: "Assets",
    dataKey: "grant_doc_num",
    staticIcon: "",
    format: numberWithCommas,
    badge: true,
  },
  {
    width: 100,
    label: "Payment Due",
    dataKey: "payment_due",
  },
  {
    width: 80,
    label: "Amount",
    dataKey: "fee_amount",
    staticIcon: "$",
    format: numberWithCommas,
  },
  {
    width: 100,
    label: "Grace End",
    dataKey: "payment_grace",
  },
  {
    width: 80,
    label: "Amount",
    dataKey: "fee_surcharge",
    staticIcon: "$",
    format: numberWithCommas,
  },
  {
    width: 100,
    label: "Expiration",
    dataKey: "remaining_year",
  },
  {
    width: 100,
    label: "Source",
    dataKey: "source",
  },
  {
    width: 100,
    label: "Citations",
    dataKey: "fwd_citation",
  },
  {
    width: 111,
    label: "Technology",
    dataKey: "technology",
  },
];

const MaintainenceAssetsList = ({
  assets,
  isLoading,
  loadMore,
  setAssetsIllustration,
  setSelectedAssetsPatents,
  setCommentsEntity,
  assetLegalEvents,
  assetFamily,
  setSelectedMaintainenceAssetsList,
  selectedMaintainencePatents,
  getChannelID,
  channel_id,
  getSlackMessages,
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [rowHeight, setRowHeight] = useState(40);
  const [width, setWidth] = useState(800);
  const tableRef = useRef();
  const [counter, setCounter] = useState(DEFAULT_CUSTOMERS_LIMIT);
  const [selectedAll, setSelectAll] = useState(false);
  const [selectItems, setSelectItems] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);
  const totalRecords = 0;
  const selectedAssetsPatents = useSelector(
    state => state.patenTrack2.selectedAssetsPatents,
  );

  const handleOnClick = useCallback(
    ({ patent, application }) => {
      /*TV, Comment, Family, FamilyItem, getChannelID Legal Events */
      if (
        selectedAssetsPatents[0] != patent ||
        selectedAssetsPatents[1] != application
      ) {
        dispatch(setConnectionBoxView(false));
        dispatch(setPDFView(false));
        dispatch(toggleUsptoMode(false));
        dispatch(toggleShow3rdParities(false));
        dispatch(toggleLifeSpanMode(false));
        dispatch(toggleFamilyMode(true));
        dispatch(toggleFamilyItemMode(true));
        dispatch(setChildSelectedAssetsPatents([]));
        dispatch(setSelectedAssetsTransactions([]));
        dispatch(setMainCompaniesRowSelect([]));
        dispatch(setAssetTypeSelectedRow([]));
        dispatch(setAssetTypeCustomerSelectedRow([]));
        dispatch(setChildSelectedAssetsTransactions([]));
        dispatch(setSlackMessages({ messages: [], users: [] }));
        dispatch(setSelectedAssetsPatents([patent, application]));
        dispatch(
          setAssetsIllustration({ type: "patent", id: patent || application }),
        );
        dispatch(
          setCommentsEntity({ type: "asset", id: patent || application }),
        );
        dispatch(assetLegalEvents(application, patent));
        dispatch(assetFamily(application));
        dispatch(getChannelID(patent, application));
      }
    },
    [dispatch, selectedAssetsPatents],
  );

  /**
   * Select first item by default
   */
  /* useEffect(() => {
    if (assets.list.length > 0) {
      setSelectedRow([assets.list[0].grant_doc_num]);
      setSelectedRow([assets.list[0].appno_doc_num]);
      handleOnClick({
        patent: assets.list[0].grant_doc_num,
        application: assets.list[0].appno_doc_num,
      });
    }
  }, [assets]); */

  useEffect(() => {
    if (selectedAssetsPatents.length == 0) {
      setSelectedRow([]);
    }
  }, [selectedAssetsPatents]);

  useEffect(() => {
    if (channel_id != "" && selectedAssetsPatents.length > 0) {
      const getSlackToken = getTokenStorage("slack_auth_token_info");
      if (getSlackToken && getSlackToken != "") {
        dispatch(getSlackMessages(channel_id));
      } else {
        //alert to user for login with slack to retrieve messages
      }
    }
  }, [dispatch, channel_id]);

  const handleClickSelectCheckbox = useCallback(
    (e, row) => {
      e.preventDefault();
      const { checked } = e.target;
      let updateSelected = [...selectedMaintainencePatents],
        oldSelection = [...selectItems];
      if (checked !== undefined) {
        if (checked === true) {
          updateSelected.push([
            row.grant_doc_num,
            row.appno_doc_num,
            "",
            row.fee_code,
            row.fee_amount,
          ]);
          oldSelection.push(row.appno_doc_num);
          const todayDate = moment(new Date()).format("YYYY-MM-DD");
          if (
            new Date(todayDate).getTime() >=
            new Date(row.payment_grace).getTime()
          ) {
            updateSelected.push([
              row.grant_doc_num,
              row.appno_doc_num,
              "",
              row.fee_code_surcharge,
              row.fee_surcharge,
            ]);
          }
        } else {
          updateSelected = selectedMaintainencePatents.filter(
            asset => asset[1] !== parseInt(row.appno_doc_num),
          );
          oldSelection = oldSelection.filter(
            asset => asset !== parseInt(row.appno_doc_num),
          );
        }
        setSelectItems(prevItems =>
          prevItems.includes(row.appno_doc_num)
            ? prevItems.filter(item => item !== row.appno_doc_num)
            : [...prevItems, row.appno_doc_num],
        );
        dispatch(setSelectedMaintainenceAssetsList(updateSelected));
      } else {
        setSelectedRow([row.grant_doc_num]);
        setSelectedRow([row.appno_doc_num]);
        handleOnClick({
          patent: row.grant_doc_num,
          application: row.appno_doc_num,
        });
      }      
    },
    [dispatch, selectedMaintainencePatents, selectItems],
  );

  const handleSelectAll = useCallback(
    (event, row) => {
      event.preventDefault();
      const { checked } = event.target;
      if (checked === false) {
        setSelectItems([]);
        dispatch(setSelectedMaintainenceAssetsList([]));
      } else if (checked === true) {
        if (assets.list.length > 0) {
          let items = [];
          assets.list.map(asset => items.push(asset.appno_doc_num));
          setSelectItems(items);
          dispatch(setSelectedMaintainenceAssetsList(items));
        }
      }
      setSelectAll(checked);
    },
    [dispatch, assets],
  );

  if (isLoading && assets.list.length == 0) return <Loader />;

  return (
    <Paper className={classes.root} square id={`maintainence_assets`}>
      <VirtualizedTable
        classes={classes}
        selected={selectItems}
        rowSelected={selectedRow}
        selectedKey={"appno_doc_num"}
        rows={assets.list}
        rowHeight={rowHeight}
        headerHeight={rowHeight}
        columns={COLUMNS}
        onSelect={handleClickSelectCheckbox}
        onSelectAll={handleSelectAll}
        defaultSelectAll={selectedAll}
        totalRows={assets.total_records}
        defaultSortField={`appno_doc_num`}
        defaultSortDirection={`desc`}
        responsive={false}
        width={width}
        containerStyle={{
          width: "100%",
          maxWidth: "100%",
        }}
        style={{
          width: "100%",
        }}
      />
    </Paper>
  );
};

export default MaintainenceAssetsList;
