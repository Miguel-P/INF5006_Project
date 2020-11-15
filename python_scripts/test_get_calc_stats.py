import unittest

# import required modules
import os
import pandas as pd
import numpy as np
import datetime 
from CAPM_Stats import GetICsAndWeights, GetBetasMktAndSpecVols, CalcStats
import math



# need to use patch and mock to check if it is reading in data from external sources properly properly

class TestGet(unittest.TestCase):

    # this is for a setup and teardown functions that only run at the beginning at end of
    # all the tests
    @classmethod
    def setUpClass(cls):
        # define path variables
        # cls.tables_path = os.path.join(os.getcwd(),"Tables_CSV")

        # read in indx_tbl and beta_tbl csv files
        # cls.indx_tbl = pd.read_csv(os.path.join(cls.tables_path,"tbl_Index_Constituents.csv"),parse_dates = ["Date"] )
        # cls.beta_tbl = pd.read_csv(os.path.join(cls.tables_path,'tbl_BA_beta_Output.csv'),parse_dates = ["Date"])
        cls.indx_tbl = pd.read_csv("python_scripts//Tables_CSV//tbl_Index_Constituents.csv",parse_dates = ["Date"] )
        cls.beta_tbl = pd.read_csv('python_scripts//Tables_CSV//tbl_BA_beta_Output.csv',parse_dates = ["Date"])


        cls.indx_alpha_codes = cls.indx_tbl["Alpha"].unique()

        # make arbitrary date
        cls.x = datetime.datetime(2017,9,18)

    @classmethod    
    def tearDownClass(cls):
        # del cls.indx_tbl
        # del cls.beta_tbl
        # del cls.x
        pass



    # set up and tear down variables for every single test
    def setUp(self):

        pass

    def tearDown(self):
        # example writing a new directory then deleting it afterwards
        pass

    # all test must start with test
    def test_GetICsandWeights(self):
        # testing with mkt index "ALSI"
        IC, weights = GetICsAndWeights(self.indx_tbl,self.x,"ALSI")

        # ensure that all IC values are valid
        self.assertTrue(set(IC).issubset(set(self.indx_alpha_codes)))

        # ensure that weights add upto 1
        self.assertTrue(math.isclose(1.0, sum(weights), rel_tol=1e-6, abs_tol=0.0))

    def test_GetBetasMktAndSpecVols(self):
        IC, weights = GetICsAndWeights(self.indx_tbl,self.x,"ALSI")

        # testing on using IC, weights (determined from previous function) and J200 index
        betas, specVols, mktVol = GetBetasMktAndSpecVols(self.beta_tbl,self.x,IC,"J200")
        
        # check that betas and specVols are of the same length
        self.assertEqual(len(betas),len(specVols))

        # check that mktVol is a scalar value
        self.assertTrue(np.isscalar(mktVol))

    def test_CalcStats(self):
        IC, weights = GetICsAndWeights(self.indx_tbl,self.x,"ALSI")
        betas, specVols, mktVol = GetBetasMktAndSpecVols(self.beta_tbl,self.x,IC,"J200")

        pfBeta, sysCov, pfSysVol, specCov, pfSpecVol, totCov, pfVol, CorrMat, indx_nan = CalcStats(weights, betas, mktVol, specVols)
        # check if all the shape of the outputs are correct
        self.assertTrue(pfBeta.shape == (1,1) and pfSysVol.shape == (1,1) and pfSpecVol.shape == (1,1) and pfVol.shape == (1,1))
        self.assertTrue(sysCov.shape[0] == sysCov.shape[1] and sysCov.shape == totCov.shape and totCov.shape == CorrMat.shape and specCov.shape == CorrMat.shape)

        # check if nan indx is correct (know this from manually checking the point)
        self.assertEqual(indx_nan,[104])

        # make sure diagonals of correlation matrix are approximately 1
        # use list comprehension to make list containing False if element is 1 and True if not
        Not_1 = [not math.isclose(1.0,i,rel_tol=1e-6, abs_tol=0.0) for i in np.diag(CorrMat)]
        self.assertEqual(0,sum(Not_1)) # this should be 0






    # # testing exceptions
    # with self.assertRaises(ValueError):
    #     # function
    #     pass


# this allows you to run the tests without passing through unittest first
# ie instead of python -m unittest test_get_calc_stats.py 
# you can just go python test_get_calc_stats.py
if __name__ == '__main__':
    unittest.main()  